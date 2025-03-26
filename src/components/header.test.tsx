import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./header";

describe("Header Component", () => {
  it("renders the header with all elements", () => {
    render(
      <Header
        navigateToHome={jest.fn()}
        navigateToFavorites={jest.fn()}
        logoutButton={jest.fn()}
      />,
    );

    const image = screen.getByAltText("dog.name");
    expect(image).toBeInTheDocument();

    const homeLink = screen.getByText("Dog Fetcher");
    expect(homeLink).toBeInTheDocument();

    const favoritesLink = screen.getByText("View Favorites");
    expect(favoritesLink).toBeInTheDocument();

    const logoutButton = screen.getByText("Logout");
    expect(logoutButton).toBeInTheDocument();
  });

  it("calls navigateToHome when 'Dog Fetcher' is clicked", () => {
    const navigateToHomeMock = jest.fn();
    render(
      <Header
        navigateToHome={navigateToHomeMock}
        navigateToFavorites={jest.fn()}
        logoutButton={jest.fn()}
      />,
    );

    const homeLink = screen.getByText("Dog Fetcher");
    fireEvent.click(homeLink);
    expect(navigateToHomeMock).toHaveBeenCalled();
  });

  it("calls navigateToFavorites when 'Favorites' is clicked", () => {
    const navigateToFavoritesMock = jest.fn();
    render(
      <Header
        navigateToHome={jest.fn()}
        navigateToFavorites={navigateToFavoritesMock}
        logoutButton={jest.fn()}
      />,
    );

    const favoritesLink = screen.getByText("View Favorites");
    fireEvent.click(favoritesLink);
    expect(navigateToFavoritesMock).toHaveBeenCalled();
  });

  it("calls logoutButton when 'Logout' is clicked", () => {
    const logoutButtonMock = jest.fn();
    render(
      <Header
        navigateToHome={jest.fn()}
        navigateToFavorites={jest.fn()}
        logoutButton={logoutButtonMock}
      />,
    );

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);
    expect(logoutButtonMock).toHaveBeenCalled();
  });
});
