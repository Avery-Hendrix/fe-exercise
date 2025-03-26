import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Favorites from "../pages/favorites";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Favorites Component", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
    localStorage.clear();
  });

  it("renders the Favorites page with no favorites", () => {
    render(<Favorites />);
    expect(screen.getByText("You have no favorites yet.")).toBeInTheDocument();
  });

  it("renders the Favorites page with favorites", async () => {
    const mockFavorites = ["1", "2"];
    const mockDogs = [
      {
        id: "1",
        name: "Dog 1",
        breed: "Breed 1",
        age: 2,
        img: "/dog1.jpg",
        zip_code: "12345",
        city: "City 1",
        state: "State 1",
      },
      {
        id: "2",
        name: "Dog 2",
        breed: "Breed 2",
        age: 3,
        img: "/dog2.jpg",
        zip_code: "67890",
        city: "City 2",
        state: "State 2",
      },
    ];

    localStorage.setItem("favorites", JSON.stringify(mockFavorites));
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockDogs),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      });

    render(<Favorites />);

    await waitFor(() => {
      expect(screen.getByText("Dog 1")).toBeInTheDocument();
      expect(screen.getByText("Dog 2")).toBeInTheDocument();
    });
  });

  it("removes a favorite when the button is clicked", async () => {
    const mockFavorites = ["1"];
    const mockDogs = [
      {
        id: "1",
        name: "Dog 1",
        breed: "Breed 1",
        age: 2,
        img: "/dog1.jpg",
        zip_code: "12345",
        city: "City 1",
        state: "State 1",
      },
    ];

    localStorage.setItem("favorites", JSON.stringify(mockFavorites));
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockDogs),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      });

    render(<Favorites />);

    await waitFor(() => {
      expect(screen.getByText("Dog 1")).toBeInTheDocument();
    });

    const removeButton = screen.getByText("Remove from Favorites");
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(
        screen.getByText("You have no favorites yet."),
      ).toBeInTheDocument();
    });
  });

  it("calls the logout function and navigates to the home page", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    render(<Favorites />);

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/");
    });
  });

  it("navigates to the home page when the home button is clicked", () => {
    render(<Favorites />);

    const homeButton = screen.getByText("Dog Fetcher");
    fireEvent.click(homeButton);

    expect(mockRouterPush).toHaveBeenCalledWith("/home");
  });
});
