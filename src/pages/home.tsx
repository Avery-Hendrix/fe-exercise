"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { baseURL, Dog, Match } from "@/src/constants/constants";
import Header from "../components/header";
import ResultsPerPageButton from "../components/resultsPerPageButton";
import PageChangeButton from "../components/pageChangeButton";
import SearchResultsRender from "../components/searchResultsRender";
import "../_app/globals.css";

export default function Home() {
  const router = useRouter();
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem("favorites");
      setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
    }
  }, []);

  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<"breed" | "name" | "age">("breed");
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState<string>("");
  const [resultsPerPage, setResultsPerPage] = useState<number>(10);
  const [zipCodeTyped, setZipCodeTyped] = useState<string>("");

  const dogBreedData = async () => {
    try {
      const response = await fetch(baseURL + "/dogs/breeds", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          `Response status: ${response.status} - ${response.statusText}`,
        );
      }
      return response.json();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetchDogBreeds = async () => {
      const breeds = await dogBreedData();
      setDogBreeds(breeds);
    };
    fetchDogBreeds();
  }, []);

  const logoutButton = () => {
    fetch(baseURL + "/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        router.push("/");
      } else {
        // Handle errors
      }
    });
  };

  const searchDogs = async (queryParams: Record<string, any>) => {
    const queryString = new URLSearchParams(queryParams).toString();
    try {
      const response = await fetch(`${baseURL}/dogs/search?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          `Response status: ${response.status} - ${response.statusText}`,
        );
      }
      const data = await response.json();
      const dogIds = data.resultIds;
      if (!Array.isArray(dogIds) || dogIds.length === 0) {
        console.error("No dog IDs returned from the search query.");
        return [];
      }

      const dogsResponse = await fetch(baseURL + "/dogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(dogIds),
      });

      if (!dogsResponse.ok) {
        throw new Error(
          `Response status: ${dogsResponse.status} - ${dogsResponse.statusText}`,
        );
      }

      const dogs = await dogsResponse.json();
      if (!Array.isArray(dogs)) {
        console.error("Invalid response format from /dogs endpoint.");
        return [];
      }

      return dogs;
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const postLocations = async (zipCodes: string[]) => {
    if (zipCodes.length > 100) {
      throw new Error(
        "The array of ZIP codes should contain no more than 100 items.",
      );
    }
    try {
      const response = await fetch(baseURL + "/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(zipCodes),
      });

      if (!response.ok) {
        throw new Error(
          `Response status: ${response.status} - ${response.statusText}`,
        );
      }
      return response.json();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      const dogCityState = async (zipCode: string) => {
        const result = await postLocations([zipCode]);
        return result && result[0]
          ? {
              city: result[0].city || "Unknown",
              state: result[0].state || "Unknown",
            }
          : { city: "Unknown", state: "Unknown" };
      };

      const queryParams: Record<string, any> = {
        size: resultsPerPage,
        from: page * resultsPerPage,
        sort: `${sortField}:${sortOrder}`,
      };

      if (selectedBreed) {
        queryParams.breeds = [selectedBreed];
        sortField === "breed" && setSortField("name");
      }

      if (zipCode) {
        queryParams.zipCodes = [zipCode];
      }

      const results = await searchDogs(queryParams);
      if (results) {
        const updatedResults = await Promise.all(
          results.map(async (dog: Dog) => {
            const location = dog.zip_code
              ? await dogCityState(dog.zip_code)
              : { city: "Unknown", state: "Unknown" };
            return { ...dog, ...location };
          }),
        );
        setSearchResults(updatedResults);
      }
    };

    fetchSearchResults();
  }, [selectedBreed, page, sortOrder, sortField, zipCode, resultsPerPage]);

  const generateMatch = async () => {
    try {
      const response = await fetch(baseURL + "/dogs/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(favorites),
      });

      if (!response.ok) {
        throw new Error(
          `Response status: ${response.status} - ${response.statusText}`,
        );
      }
      const match: Match = await response.json();
      alert(`Match: ${match.match}`);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const zipCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setZipCode(zipCode);
  };

  const breedDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBreed(e.target.value);
    setPage(0);
  };

  const resetOnClick = () => {
    setZipCode("");
    setZipCodeTyped("");
  };

  useEffect(() => {
    // Save favorites to local storage whenever they change
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const navigateToFavorites = (): void => {
    router.push("/favorites");
  };

  return (
    <div>
      <Header
        logoutButton={logoutButton}
        navigateToFavorites={navigateToFavorites}
      />
      <main className="flex flex-col gap-8 items-center pb-4 px-4">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <select
            onChange={breedDropdownChange}
            value={selectedBreed || ""}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Breeds</option>
            {dogBreeds.map((breed, index) => (
              <option key={index} value={breed}>
                {breed}
              </option>
            ))}
          </select>
          <span className="py-2 font-medium">Filter:</span>
          <select
            onChange={(e) =>
              setSortField(e.target.value as "breed" | "name" | "age")
            }
            value={sortField}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Sort Field
            </option>
            {!selectedBreed && <option value="breed">Breed</option>}
            <option value="name">Name</option>
            <option value="age">Age</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full sm:w-auto"
          >
            Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
          </button>
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <form
            onSubmit={zipCodeSubmit}
            className="flex flex-wrap gap-4 items-center justify-center"
          >
            <input
              type="text"
              placeholder="ZIP Code"
              value={zipCodeTyped}
              onChange={(e) => setZipCodeTyped(e.target.value)}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full sm:w-auto"
              onClick={() => setZipCode(zipCodeTyped)}
            >
              Go
            </button>
            <button
              type="button"
              onClick={resetOnClick}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition w-full sm:w-auto"
            >
              Reset
            </button>
          </form>
        </div>
        {searchResults && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            {searchResults.map((dog) =>
              SearchResultsRender({
                dog,
                setSelectedBreed,
                setPage,
                setFavorites,
                favorites,
              }),
            )}
          </div>
        )}
        <button className="font-medium">Favorites: {favorites.length}</button>
        <span className="py-4 font-medium">Page: {page + 1}</span>
        <div className="flex flex-wrap gap-4 mt-4 items-center justify-center">
          {PageChangeButton({
            page,
            onClick: () => setPage((prev) => Math.max(prev - 1, 0)),
            text: "Previous Page",
          })}
          <span className="py-4 font-medium">Results per page:</span>
          {ResultsPerPageButton({ resultsPerPage, setResultsPerPage })}
          {PageChangeButton({
            page,
            onClick: () => setPage((prev) => prev + 1),
            text: "Next Page",
          })}
          <button
            onClick={generateMatch}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition w-full sm:w-auto"
          >
            Generate Match
          </button>
        </div>
      </main>
    </div>
  );
}
