"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { baseURL, Dog } from "@/src/constants/constants";
import Header from "../components/header";
import ResultsPerPageButton from "../components/resultsPerPageButton";
import PageChangeButton from "../components/pageChangeButton";
import SearchResultsRender from "../components/searchResultsRender";
import "../_app/globals.css";
import { Match } from '../constants/constants';

export default function Home() {
  const router = useRouter();
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMatch, setModalMatch] = useState<Dog[] | null>(null);
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<"breed" | "name" | "age">("breed");
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState<string>("");
  const [resultsPerPage, setResultsPerPage] = useState<number>(10);
  const [zipCodeTyped, setZipCodeTyped] = useState<string>("");

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
  }, []);

  useEffect(() => {
    const fetchDogBreeds = async () => {
      try {
        const response = await fetch(`${baseURL}/dogs/breeds`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          setDogBreeds(await response.json());
        } else {
          console.error("Failed to fetch dog breeds");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDogBreeds();
  }, []);

  useEffect(() => {
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
        ...(selectedBreed && { breeds: [selectedBreed] }),
        ...(zipCode && { zipCodes: [zipCode] }),
      };

      try {
        const response = await fetch(
          `${baseURL}/dogs/search?${new URLSearchParams(queryParams).toString()}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );

        if (response.ok) {
          const { resultIds } = await response.json();
          if (resultIds?.length) {
            const dogsResponse = await fetch(`${baseURL}/dogs`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify(resultIds),
            });

            if (dogsResponse.ok) {
              const dogs = await dogsResponse.json();
              for (const dog of dogs) {
                const { city, state } = await dogCityState(dog.zip_code);
                dog.city = city;
                dog.state = state;
              }
              setSearchResults(dogs);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSearchResults();
  }, [selectedBreed, page, sortOrder, sortField, zipCode, resultsPerPage]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const logoutButton = async () => {
    try {
      const response = await fetch(`${baseURL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) router.push("/");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  const generateMatch = async () => {
    try {
      const response = await fetch(`${baseURL}/dogs/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(favorites),
      });

      if (response.ok) {
        const dogMatch: Match = await response.json();
        const dogsResponse = await fetch(`${baseURL}/dogs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify([dogMatch.match]),
        });

        if (dogsResponse.ok) {
          setModalMatch(await dogsResponse.json());
          setModalOpen(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetFilters = () => {
    setZipCode("");
    setZipCodeTyped("");
    setSelectedBreed(null);
    setPage(0);
  };

  return (
    <div>
      <Header
        logoutButton={logoutButton}
        navigateToFavorites={() => router.push("/favorites")}
      />
      <main className="flex flex-col gap-8 items-center pb-4 px-4">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <select
            onChange={(e) => {
              setSelectedBreed(e.target.value);
              setPage(0);
            }}
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
            <option value="breed">Breed</option>
            <option value="name">Name</option>
            <option value="age">Age</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setZipCode(zipCodeTyped);
          }}
          className="flex flex-wrap gap-4 items-center justify-center"
        >
          <input
            type="text"
            placeholder="ZIP Code"
            value={zipCodeTyped}
            onChange={(e) => setZipCodeTyped(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Go
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Reset
          </button>
        </form>
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
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            Generate Match
          </button>
        </div>
      </main>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Match Result
            </h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {modalMatch?.map((dog) => (
                <div key={dog.id} className="flex flex-col items-center">
                  <img
                    src={dog.img}
                    alt={dog.name}
                    className="rounded-full w-32 h-32"
                  />
                  <h3 className="text-xl font-bold">{dog.name}</h3>
                  <p className="text-gray-700">Breed: {dog.breed}</p>
                  <p className="text-gray-700">Age: {dog.age}</p>
                  <p className="text-gray-700">
                    Location: {dog.city}, {dog.state}
                  </p>
                  <p className="text-gray-700">Zip Code: {dog.zip_code}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-6 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition block mx-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
