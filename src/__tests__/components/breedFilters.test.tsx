import { render, screen, fireEvent } from "@testing-library/react";

import { BreedFilters } from "@/src/components";

describe("BreedFilters", () => {
  const mockSetSelectedBreed = jest.fn();
  const mockSetSortField = jest.fn();
  const mockSetSortOrder = jest.fn();
  const mockResetFilters = jest.fn();
  const mockSetPage = jest.fn();

  const defaultProps = {
    setSelectedBreed: mockSetSelectedBreed,
    setSortField: mockSetSortField,
    setSortOrder: mockSetSortOrder,
    resetFilters: mockResetFilters,
    dogBreeds: ["Labrador", "Beagle", "Poodle"],
    selectedBreed: null,
    setPage: mockSetPage,
    sortField: "breed" as const,
    sortOrder: "asc" as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all elements correctly", () => {
    render(<BreedFilters {...defaultProps} />);

    expect(screen.getByText("All Breeds")).toBeInTheDocument();
    expect(screen.getByText("Filter:")).toBeInTheDocument();
    expect(screen.getByText("Sort Descending")).toBeInTheDocument();
    expect(screen.getByText("Reset Filters")).toBeInTheDocument();

    defaultProps.dogBreeds.forEach((breed) => {
      expect(screen.getByText(breed)).toBeInTheDocument();
    });
  });

  it("calls setSelectedBreed and setPage when a breed is selected", () => {
    render(<BreedFilters {...defaultProps} />);

    fireEvent.change(screen.getByRole("combobox", { name: "Breed Selector" }), {
      target: { value: "Beagle" },
    });

    expect(mockSetSelectedBreed).toHaveBeenCalledWith("Beagle");
    expect(mockSetPage).toHaveBeenCalledWith(0);
  });

  it("calls setSortField when a sort field is selected", () => {
    render(<BreedFilters {...defaultProps} />);

    fireEvent.change(screen.getByRole("combobox", { name: "Sort Field" }), {
      target: { value: "name" },
    });

    expect(mockSetSortField).toHaveBeenCalledWith("name");
  });

  it("toggles sort order when the sort button is clicked", () => {
    render(<BreedFilters {...defaultProps} />);

    fireEvent.click(screen.getByText("Sort Descending"));

    expect(mockSetSortOrder).toHaveBeenCalledWith("desc");
  });

  it("calls resetFilters when the reset button is clicked", () => {
    render(<BreedFilters {...defaultProps} />);

    fireEvent.click(screen.getByText("Reset Filters"));

    expect(mockResetFilters).toHaveBeenCalled();
  });
});
