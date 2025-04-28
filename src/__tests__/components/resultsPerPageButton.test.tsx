import { render, screen, fireEvent } from "@testing-library/react";

import { ResultsPerPageButton } from "@/src/components";

describe("ResultsPerPageButton", () => {
  const mockSetResultsPerPage = jest.fn();

  beforeEach(() => {
    mockSetResultsPerPage.mockClear();
  });

  it("renders all buttons with correct text", () => {
    render(
      <ResultsPerPageButton
        resultsPerPage={10}
        setResultsPerPage={mockSetResultsPerPage}
      />,
    );

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("applies correct styles to the active button", () => {
    render(
      <ResultsPerPageButton
        resultsPerPage={25}
        setResultsPerPage={mockSetResultsPerPage}
      />,
    );

    const button10 = screen.getByText("10");
    const button25 = screen.getByText("25");
    const button50 = screen.getByText("50");

    expect(button10).not.toHaveClass("underline text-blue-500");
    expect(button25).toHaveClass("underline text-blue-500");
    expect(button50).not.toHaveClass("underline text-blue-500");
  });

  it("calls setResultsPerPage with correct value when a button is clicked", () => {
    render(
      <ResultsPerPageButton
        resultsPerPage={10}
        setResultsPerPage={mockSetResultsPerPage}
      />,
    );

    const button25 = screen.getByText("25");
    fireEvent.click(button25);

    expect(mockSetResultsPerPage).toHaveBeenCalledWith(25);

    const button50 = screen.getByText("50");
    fireEvent.click(button50);

    expect(mockSetResultsPerPage).toHaveBeenCalledWith(50);
  });
});
