import { render, screen, fireEvent } from "@testing-library/react";
import SearchResultsRender from "../components/searchResultsRender";
import { Dog } from "../constants/constants";

describe("SearchResultsRender Component", () => {
  const mockDog: Dog = {
    id: "1",
    name: "Buddy",
    breed: "Golden Retriever",
    age: 3,
    city: "New York",
    state: "NY",
    zip_code: "10001",
    img: "/buddy.jpg",
  };

  const mockSetSelectedBreed = jest.fn();
  const mockSetPage = jest.fn();
  const mockSetFavorites = jest.fn();
  const mockFavorites: string[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dog details correctly", () => {
    render(
      <SearchResultsRender
        dog={mockDog}
        setSelectedBreed={mockSetSelectedBreed}
        setPage={mockSetPage}
        setFavorites={mockSetFavorites}
        favorites={mockFavorites}
      />,
    );

    expect(screen.getByText(mockDog.name)).toBeInTheDocument();
    expect(screen.getByText(`Breed: ${mockDog.breed}`)).toBeInTheDocument();
    expect(screen.getByText(`Age: ${mockDog.age}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Location: ${mockDog.city}, ${mockDog.state}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Zip Code: ${mockDog.zip_code}`),
    ).toBeInTheDocument();
    expect(screen.getByAltText(mockDog.name)).toBeInTheDocument();
  });

  it("calls setSelectedBreed and setPage when breed button is clicked", () => {
    render(
      <SearchResultsRender
        dog={mockDog}
        setSelectedBreed={mockSetSelectedBreed}
        setPage={mockSetPage}
        setFavorites={mockSetFavorites}
        favorites={mockFavorites}
      />,
    );

    const breedButton = screen.getByText(`Breed: ${mockDog.breed}`);
    fireEvent.click(breedButton);

    expect(mockSetSelectedBreed).toHaveBeenCalledWith(mockDog.breed);
    expect(mockSetPage).toHaveBeenCalledWith(0);
  });

  it("adds dog to favorites when 'Add to Favorites' button is clicked", () => {
    render(
      <SearchResultsRender
        dog={mockDog}
        setSelectedBreed={mockSetSelectedBreed}
        setPage={mockSetPage}
        setFavorites={mockSetFavorites}
        favorites={mockFavorites}
      />,
    );

    const favoriteButton = screen.getByText("Add to Favorites");
    fireEvent.click(favoriteButton);

    expect(mockSetFavorites).toHaveBeenCalledWith(expect.any(Function));
    const updateFavorites = mockSetFavorites.mock.calls[0][0];
    expect(updateFavorites([])).toEqual([mockDog.id]);
  });

  it("removes dog from favorites when 'Remove from Favorites' button is clicked", () => {
    render(
      <SearchResultsRender
        dog={mockDog}
        setSelectedBreed={mockSetSelectedBreed}
        setPage={mockSetPage}
        setFavorites={mockSetFavorites}
        favorites={[mockDog.id]}
      />,
    );

    const favoriteButton = screen.getByText("Remove from Favorites");
    fireEvent.click(favoriteButton);

    expect(mockSetFavorites).toHaveBeenCalledWith(expect.any(Function));
    const updateFavorites = mockSetFavorites.mock.calls[0][0];
    expect(updateFavorites([mockDog.id])).toEqual([]);
  });
});
