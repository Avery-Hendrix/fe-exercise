import { render, screen, fireEvent } from "@testing-library/react";

import { CityStateForm } from "@/src/components";

describe("CityStateForm", () => {
  const mockSetLocation = jest.fn();
  const mockGetSearchLocations = jest.fn();
  const mockHandleFindMyLocation = jest.fn();

  const defaultProps = {
    location: { city: "", state: "" },
    setLocation: mockSetLocation,
    getSearchLocations: mockGetSearchLocations,
    handleFindMyLocation: mockHandleFindMyLocation,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with inputs and buttons", () => {
    render(<CityStateForm {...defaultProps} />);

    expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("State")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Find My Location")).toBeInTheDocument();
  });

  it("calls setLocation with updated city in uppercase when city input changes", () => {
    render(<CityStateForm {...defaultProps} />);

    const cityInput = screen.getByPlaceholderText("City");
    fireEvent.change(cityInput, { target: { value: "new york" } });

    expect(mockSetLocation).toHaveBeenCalledWith({
      city: "NEW YORK",
      state: "",
    });
  });

  it("calls setLocation with updated state in uppercase when state input changes", () => {
    render(<CityStateForm {...defaultProps} />);

    const stateInput = screen.getByPlaceholderText("State");
    fireEvent.change(stateInput, { target: { value: "ny" } });

    expect(mockSetLocation).toHaveBeenCalledWith({ city: "", state: "NY" });
  });

  it("calls setLocation and getSearchLocations on form submission", () => {
    render(<CityStateForm {...defaultProps} />);

    const submitButton = screen.getByTestId("submit-location");
    fireEvent.click(submitButton);

    expect(mockSetLocation).toHaveBeenCalledWith({ city: "", state: "" });
    expect(mockGetSearchLocations).toHaveBeenCalled();
  });

  it('calls handleFindMyLocation when "Find My Location" button is clicked', () => {
    render(<CityStateForm {...defaultProps} />);

    const findMyLocationButton = screen.getByText("Find My Location");
    fireEvent.click(findMyLocationButton);

    expect(mockHandleFindMyLocation).toHaveBeenCalled();
  });
});
