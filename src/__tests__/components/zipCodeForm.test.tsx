import { render, screen, fireEvent } from "@testing-library/react";

import { ZipCodeForm } from "@/src/components";

describe("ZipCodeForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockZipCodeOnChange = jest.fn();
  const mockZipCodeOnSubmit = jest.fn((e) => e.preventDefault());
  const mockResetFilters = jest.fn();

  it("renders input, submit button, and reset button", () => {
    render(
      <ZipCodeForm
        zipCodeTyped={""}
        zipCodeOnChange={mockZipCodeOnChange}
        zipCodeOnSubmit={mockZipCodeOnSubmit}
        resetFilters={mockResetFilters}
      />,
    );
    expect(screen.getByPlaceholderText("ZIP Code")).toBeInTheDocument();
    expect(screen.getByTestId("submit-zip-code")).toBeInTheDocument();
    expect(screen.getByText("Reset Location")).toBeInTheDocument();
  });

  it("calls zipCodeOnChange when typing in the input", () => {
    render(
      <ZipCodeForm
        zipCodeTyped={""}
        zipCodeOnChange={mockZipCodeOnChange}
        zipCodeOnSubmit={mockZipCodeOnSubmit}
        resetFilters={mockResetFilters}
      />,
    );
    const input = screen.getByPlaceholderText("ZIP Code");
    fireEvent.change(input, { target: { value: "12345" } });
    expect(mockZipCodeOnChange).toHaveBeenCalledTimes(1);
  });

  it("calls zipCodeOnSubmit when the form is submitted", () => {
    render(
      <ZipCodeForm
        zipCodeTyped={"12345"}
        zipCodeOnChange={mockZipCodeOnChange}
        zipCodeOnSubmit={mockZipCodeOnSubmit}
        resetFilters={mockResetFilters}
      />,
    );
    const form = screen.getByRole("form");
    fireEvent.submit(form);
    expect(mockZipCodeOnSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls resetFilters when the reset button is clicked", () => {
    render(
      <ZipCodeForm
        zipCodeTyped={"12345"}
        zipCodeOnChange={mockZipCodeOnChange}
        zipCodeOnSubmit={mockZipCodeOnSubmit}
        resetFilters={mockResetFilters}
      />,
    );
    const resetButton = screen.getByText("Reset Location");
    fireEvent.click(resetButton);
    expect(mockResetFilters).toHaveBeenCalledTimes(1);
  });

  it("displays the correct value in the input field", () => {
    render(
      <ZipCodeForm
        zipCodeTyped={"12345"}
        zipCodeOnChange={mockZipCodeOnChange}
        zipCodeOnSubmit={mockZipCodeOnSubmit}
        resetFilters={mockResetFilters}
      />,
    );
    const input = screen.getByPlaceholderText("ZIP Code") as HTMLInputElement;
    expect(input.value).toBe("12345");
  });
});
