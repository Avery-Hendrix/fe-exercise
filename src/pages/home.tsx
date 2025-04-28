"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  BreedFilters,
  CityStateForm,
  Header,
  MatchModal,
  PageChangeButton,
  ResultsPerPageButton,
  SearchResultsRender,
  ZipCodeForm,
} from "@/src/components";
import { baseURL, Coordinates, Dog, Match } from "@/src/constants/constants";

import "../_app/globals.css";

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
  const [location, setLocation] = useState<{ city: string; state: string }>({
    city: "",
    state: "",
  });

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
    setLocation({ city: "", state: "" });
    setSelectedBreed(null);
    setPage(0);
  };

  const searchLocations = async (queryParams: {
    city?: string;
    states?: string[];
    geoBoundingBox?: {
      top?: number;
      left?: number;
      bottom?: number;
      right?: number;
      bottom_left?: Coordinates;
      top_left?: Coordinates;
    };
    size?: number;
    from?: number;
  }) => {
    try {
      const response = await fetch(baseURL + "/locations/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(queryParams),
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

  const getSearchLocations = async () => {
    const results = await searchLocations({
      city: location.city || undefined,
      states: location.state ? [location.state] : undefined,
      size: 10,
      from: 0,
    });
    setZipCodeTyped(
      location.city && location.state.length === 2
        ? results.results[0]?.zip_code
        : "",
    );
    setZipCode(
      location.city && location.state.length === 2
        ? results.results[0]?.zip_code
        : "",
    );
  };

  const findMyLocation = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const geoBoundingBox = {
          top: latitude + 0.1,
          bottom: latitude - 0.1,
          left: longitude - 0.1,
          right: longitude + 0.1,
        };

        const locationResults = await searchLocations({
          geoBoundingBox,
          size: 10,
          from: 0,
        });

        console.log(
          locationResults.results[0],
          "search locations results using geolocation",
        );

        if (locationResults.results) {
          const { city, state } = locationResults.results[0];
          await setLocation({ city, state });
          await setZipCode(locationResults.results[0].zip_code);
          setZipCodeTyped(locationResults.results[0].zip_code);
          console.log(`Location found: ${city}, ${state}`);
        } else {
          console.log("No locations found.");
        }
      },
      (error) => {
        console.error("Error fetching geolocation:", error.message);
      },
    );
  };

  const handleFindMyLocation = async () => {
    await findMyLocation();
  };

  const zipCodeOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[0-9]{0,5}$/;
    if (regex.test(value)) {
      setZipCodeTyped(value);
    } else if (value === "") {
      setZipCodeTyped("");
    } else {
      alert("Invalid ZIP code format");
    }
  };

  const zipCodeOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (zipCodeTyped.length === 5) {
      const response = await fetch(
        `${baseURL}/dogs/search?zipCodes=${zipCodeTyped}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (response.ok) {
        const { resultIds } = await response.json();
        if (resultIds?.length) {
          setZipCode(zipCodeTyped);
        } else {
          alert("No dogs found for the entered ZIP code.");
        }
      } else {
        alert("Failed to validate ZIP code. Please try again.");
      }
    } else if (zipCodeTyped.length === 0) {
      setZipCode("");
    } else if (zipCodeTyped !== "") {
      alert("Invalid ZIP code. Please enter a 5-digit ZIP code.");
    }
  };

  return (
    <div>
      <Header
        logoutButton={logoutButton}
        navigateToFavorites={() => router.push("/favorites")}
      />
      <main className="flex flex-col gap-8 items-center pb-4 px-4">
        {BreedFilters({
          setSelectedBreed,
          setSortField,
          setSortOrder,
          resetFilters,
          dogBreeds,
          selectedBreed,
          setPage,
          sortField,
          sortOrder,
        })}
        {ZipCodeForm({
          zipCodeTyped,
          zipCodeOnChange,
          zipCodeOnSubmit,
          resetFilters,
        })}
        {CityStateForm({
          location,
          setLocation,
          getSearchLocations,
          handleFindMyLocation,
        })}
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
      {modalOpen && MatchModal({ modalMatch, setModalOpen })}
    </div>
  );
}
