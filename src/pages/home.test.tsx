import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./home";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Home Page", () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest
      .spyOn(window.localStorage.__proto__, "getItem")
      .mockImplementation(() => JSON.stringify(["dog1", "dog2"]));
    jest
      .spyOn(window.localStorage.__proto__, "setItem")
      .mockImplementation(() => {});
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Home component", () => {
    render(<Home />);
    expect(screen.getByText("Dog Fetcher")).toBeInTheDocument();
  });

  it("fetches and displays dog breeds", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ["Breed1", "Breed2"],
    });

    render(<Home />);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/dogs/breeds"),
        expect.any(Object),
      ),
    );
    expect(screen.getByText("Breed1")).toBeInTheDocument();
    expect(screen.getByText("Breed2")).toBeInTheDocument();
  });

  // it("handles logout button click", async () => {
  //   (global.fetch as jest.Mock).mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => ["Breed1", "Breed2"],
  //   });

  //   render(<Home />);

  //   await waitFor(() =>
  //     expect(global.fetch).toHaveBeenCalledWith(
  //       expect.stringContaining("/dogs/breeds"),
  //       expect.any(Object),
  //     ),
  //   );
  //   const logoutButton = screen.getByText("Logout");
  //   expect(logoutButton).toBeInTheDocument();
  //   userEvent.click(logoutButton);
  //   await waitFor(() =>
  //     expect(global.fetch).toHaveBeenCalledWith(
  //       expect.stringContaining("/auth/logout"),
  //       expect.any(Object),
  //     ),
  //   );
  //   expect(mockPush).toHaveBeenCalledWith("/");
  // });

  it("handles ZIP code submission", async () => {
    render(<Home />);
    const zipInput = screen.getByPlaceholderText("ZIP Code");
    const goButton = screen.getByText("Go");

    fireEvent.change(zipInput, { target: { value: "12345" } });
    fireEvent.click(goButton);

    await waitFor(() =>
      expect(screen.getByDisplayValue("12345")).toBeInTheDocument(),
    );
  });

  it("handles breed dropdown change", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ["Breed1", "Breed2"],
    });
    render(<Home />);
    const breedDropdown = screen.getByDisplayValue("");

    fireEvent.change(breedDropdown, { target: { value: "Breed1" } });

    await waitFor(() => expect(breedDropdown).toHaveValue("Breed1"));
  });

  it("handles sort order toggle", () => {
    render(<Home />);
    const sortButton = screen.getByText("Sort Descending");

    fireEvent.click(sortButton);

    expect(sortButton).toHaveTextContent("Sort Ascending");
  });

  // it("handles generate match button click", async () => {
  //   (global.fetch as jest.Mock)
  //     .mockResolvedValueOnce({
  //       ok: true,
  //       json: async () => ["Breed1", "Breed2"], // Mock dog breeds array
  //     })
  //     .mockResolvedValueOnce({
  //       ok: true,
  //       json: async () => ({ match: "Best Match" }), // Mock match response
  //     });

  //   render(<Home />);
  //   const generateMatchButton = screen.getByText("Generate Match");

  //   fireEvent.click(generateMatchButton);

  //   await waitFor(() =>
  //     expect(window.alert).toHaveBeenCalledWith("Match: Best Match"),
  //   );
  // });
});
