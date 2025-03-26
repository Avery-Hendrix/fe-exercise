import { render, screen, fireEvent } from "@testing-library/react";
import PageChangeButton from "./pageChangeButton";

describe("PageChangeButton", () => {
  it("renders the button with the correct text", () => {
    render(<PageChangeButton page={1} onClick={() => {}} text="Next Page" />);
    expect(screen.getByRole("button")).toHaveTextContent("Next Page");
  });

  it('disables the button when text is "Previous Page" and page is 0', () => {
    render(
      <PageChangeButton page={0} onClick={() => {}} text="Previous Page" />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it('enables the button when text is "Previous Page" and page is greater than 0', () => {
    render(
      <PageChangeButton page={1} onClick={() => {}} text="Previous Page" />,
    );
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("calls the onClick handler when the button is clicked", () => {
    const handleClick = jest.fn();
    render(
      <PageChangeButton page={1} onClick={handleClick} text="Next Page" />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies the correct class names", () => {
    render(<PageChangeButton page={1} onClick={() => {}} text="Next Page" />);
    expect(screen.getByRole("button")).toHaveClass(
      "bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-600 transition",
    );
  });
});
