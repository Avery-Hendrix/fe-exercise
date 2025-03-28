import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../pages/home";
import { baseURL } from "../constants/constants";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe("Home Page", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders the Home component", () => {
    render(<Home />);
    expect(screen.getByText("Dog Fetcher")).toBeInTheDocument();
    expect(screen.getByText("All Breeds")).toBeInTheDocument();
    expect(screen.getByText("Filter:")).toBeInTheDocument();
    expect(screen.getByText("Sort Descending")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ZIP Code")).toBeInTheDocument();
  });

  it("fetches and displays dog breeds", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(["Labrador", "Poodle"]),
    });

    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText("Labrador")).toBeInTheDocument();
      expect(screen.getByText("Poodle")).toBeInTheDocument();
    });
  });

  it("handles ZIP code input and reset filters", () => {
    render(<Home />);

    const zipInput = screen.getByPlaceholderText("ZIP Code");
    const resetButton = screen.getByText("Reset");

    fireEvent.change(zipInput, { target: { value: "12345" } });
    expect(zipInput).toHaveValue("12345");

    fireEvent.click(resetButton);
    expect(zipInput).toHaveValue("");
  });

  it("handles ZIP code submission", async () => {
    render(<Home />);
    const zipInput = screen.getByPlaceholderText("ZIP Code");
    const goButton = screen.getByText("Go");

    fireEvent.change(zipInput, { target: { value: "12345" } });
    fireEvent.click(goButton);

    await waitFor(() => {
      expect(zipInput).toHaveValue("12345");
    });
  });

  it("toggles sort order", () => {
    render(<Home />);

    const sortButton = screen.getByText("Sort Descending");
    fireEvent.click(sortButton);

    expect(sortButton).toHaveTextContent("Sort Ascending");
  });

  it("calls generateMatch and opens modal", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(["dog1"]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(["dog1"]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(["dog1"]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([
          {
            id: "dog1",
            name: "Dog1",
            img: "",
            breed: "Breed1",
            age: 2,
            city: "City1",
            state: "State1",
            zip_code: "12345",
          },
        ]),
      });

    render(<Home />);

    const generateMatchButton = screen.getByText("Generate Match");
    fireEvent.click(generateMatchButton);

    await waitFor(() => {
      expect(screen.getByText("Match Result")).toBeInTheDocument();
      expect(screen.getByText("Dog1")).toBeInTheDocument();
    });
  });

  it("handles pagination buttons", () => {
    render(<Home />);

    const nextPageButton = screen.getByText("Next Page");
    fireEvent.click(nextPageButton);

    const prevPageButton = screen.getByText("Previous Page");
    fireEvent.click(prevPageButton);
  });

  it("saves and retrieves favorites from localStorage", () => {
    localStorage.setItem("favorites", JSON.stringify(["dog1"]));
    render(<Home />);

    expect(localStorage.getItem("favorites")).toBe(JSON.stringify(["dog1"]));
  });

  it("fetches search results", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(["1"]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ resultIds: ["1", "2"] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: "1", name: "Buddy", breed: "Labrador", zip_code: "12345" },
          { id: "2", name: "Max", breed: "Poodle", zip_code: "67890" },
        ],
      });

    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText("Buddy")).toBeInTheDocument();
      expect(screen.getByText("Max")).toBeInTheDocument();
    });
  });

  it("handles logout", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    render(<Home />);
    const logoutButton = screen.getByText("Logout");

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${baseURL}/auth/logout`,
        expect.any(Object),
      );
    });
  });
});
