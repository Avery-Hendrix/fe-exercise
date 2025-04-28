import { render, screen, fireEvent } from "@testing-library/react";

import { MatchModal } from "@/src/components";

const mockDogs = [
  {
    id: "1",
    img: "dog1.jpg",
    name: "Buddy",
    breed: "Golden Retriever",
    age: 3,
    city: "New York",
    state: "NY",
    zip_code: "10001",
  },
  {
    id: "2",
    img: "dog2.jpg",
    name: "Max",
    breed: "Labrador",
    age: 5,
    city: "Los Angeles",
    state: "CA",
    zip_code: "90001",
  },
];

describe("MatchModal", () => {
  it("renders the modal with the correct title", () => {
    render(<MatchModal modalMatch={mockDogs} setModalOpen={jest.fn()} />);
    expect(screen.getByText("Match Result")).toBeInTheDocument();
  });

  it("renders the list of dogs correctly", () => {
    render(<MatchModal modalMatch={mockDogs} setModalOpen={jest.fn()} />);
    mockDogs.forEach((dog) => {
      expect(screen.getByText(dog.name)).toBeInTheDocument();
      expect(screen.getByText(`Breed: ${dog.breed}`)).toBeInTheDocument();
      expect(screen.getByText(`Age: ${dog.age}`)).toBeInTheDocument();
      expect(
        screen.getByText(`Location: ${dog.city}, ${dog.state}`),
      ).toBeInTheDocument();
      expect(screen.getByText(`Zip Code: ${dog.zip_code}`)).toBeInTheDocument();
    });
  });

  it("renders the close button and triggers setModalOpen on click", () => {
    const mockSetModalOpen = jest.fn();
    render(
      <MatchModal modalMatch={mockDogs} setModalOpen={mockSetModalOpen} />,
    );
    const closeButton = screen.getByText("Close");
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
  });

  it("handles empty or null modalMatch gracefully", () => {
    render(<MatchModal modalMatch={null} setModalOpen={jest.fn()} />);
    expect(screen.queryByText(mockDogs[0].name)).not.toBeInTheDocument();
    expect(screen.queryByText(mockDogs[1].name)).not.toBeInTheDocument();
  });
});
