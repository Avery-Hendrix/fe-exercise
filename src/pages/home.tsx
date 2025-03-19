'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { baseURL, Dog, Match } from "@/src/components/constants";
import '../_app/globals.css'

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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<'breed' | 'name' | 'age'>('breed');
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState<string>('');
  const [resultsPerPage, setResultsPerPage] = useState<number>(10);
  const [zipCodeTyped, setZipCodeTyped] = useState<string>('');

  const dogBreedData = async () => {
    try {
      const response = await fetch(baseURL + '/dogs/breeds', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status} - ${response.statusText}`);
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
    fetch(baseURL + '/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include"
    })
      .then((response) => {
        if (response.ok) {
          router.push('/')
        } else {
          // Handle errors
        }
      })
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
        throw new Error(`Response status: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      const dogIds = data.resultIds;
      const dogsResponse = await fetch(baseURL + '/dogs', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(dogIds),
      });

      if (!dogsResponse.ok) {
        throw new Error(`Response status: ${dogsResponse.status} - ${dogsResponse.statusText}`);
      }
      return dogsResponse.json();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const postLocations = async (zipCodes: string[]) => {
    if (zipCodes.length > 100) {
      throw new Error("The array of ZIP codes should contain no more than 100 items.");
    }
    try {
      const response = await fetch(baseURL + '/locations', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(zipCodes),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  // const searchLocations = async (queryParams: {
  //   city?: string,
  //   states?: string[],
  //   geoBoundingBox?: {
  //     top?: number,
  //     left?: number,
  //     bottom?: number,
  //     right?: number,
  //     bottom_left?: Coordinates,
  //     top_left?: Coordinates
  //   },
  //   size?: number,
  //   from?: number
  // }) => {
  //   try {
  //     const response = await fetch(baseURL + '/locations/search', {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify(queryParams),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Response status: ${response.status} - ${response.statusText}`);
  //     }
  //     return response.json();
  //   } catch (error: any) {
  //     console.error(error.message);
  //   }
  // };

  // useEffect(() => {
  //   const testSearchLocations = async () => {
  //     const results = await searchLocations({
  //       city: city || undefined,
  //       states: state ? [state] : undefined,
  //       size: 10,
  //       from: 0,
  //     });
  //     console.log(results, 'search locations results');
  //   }
  //   testSearchLocations();
  // }, [city, state]);

  // }, [zipCode, city, state]);

  // const searchLocations = async (queryParams: {
  //   city?: string,
  //   states?: string[],
  //   geoBoundingBox?: {
  //     top?: number,
  //     left?: number,
  //     bottom?: number,
  //     right?: number,
  //     bottom_left?: Coordinates,
  //     top_left?: Coordinates
  //   },
  //   size?: number,
  //   from?: number
  // }) => {
  //   try {
  //     const response = await fetch(baseURL + '/locations/search', {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify(queryParams),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Response status: ${response.status} - ${response.statusText}`);
  //     }
  //     return response.json();
  //   } catch (error: any) {
  //     console.error(error.message);
  //   }
  // };

  // useEffect(() => {
  //   const testSearchLocations = async () => {
  //     const results = await searchLocations({
  //       city: city || undefined,
  //       states: state ? [state] : undefined,
  //       size: 10,
  //       from: 0,
  //     });
  //     console.log(results, 'search locations results');
  //   }
  //   testSearchLocations();
  // }, [city, state]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      const dogCityState = async (zipCode: string) => {
        const result = await postLocations([zipCode]);
        return { city: result[0].city, state: result[0].state };
      };

      const queryParams: Record<string, any> = {
        size: resultsPerPage,
        from: page * resultsPerPage,
        sort: `${sortField}:${sortOrder}`,
      };

      if (selectedBreed) {
        queryParams.breeds = [selectedBreed];
      }

      if (zipCode) {
        queryParams.zipCodes = [zipCode];
      }

      const results = await searchDogs(queryParams);
      if (results) {
        const updatedResults = await Promise.all(
          results.map(async (dog: Dog) => {
            const location = await dogCityState(dog.zip_code);
            return { ...dog, ...location };
          })
        );
        setSearchResults(updatedResults);
      }
    };

    fetchSearchResults();
  }, [selectedBreed, page, sortOrder, sortField, zipCode, resultsPerPage]);

  const toggleFavorite = (dogId: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(dogId)
        ? prevFavorites.filter((id) => id !== dogId)
        : [...prevFavorites, dogId]
    );
  };

  const generateMatch = async () => {
    try {
      const response = await fetch(baseURL + '/dogs/match', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(favorites),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status} - ${response.statusText}`);
      }
      const match: Match = await response.json();
      alert(`Match: ${match.match}`);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const sortedBreeds = [...dogBreeds].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.localeCompare(b);
    } else {
      return b.localeCompare(a);
    }
  });

  const zipCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setZipCode(zipCode);
  }

  const breedPictureNameClick = (breed: string) => {
    setSelectedBreed(breed)
    setPage(0)
  }

  const breedDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBreed(e.target.value)
    setPage(0)
  }

  const resetOnClick = () => {
    setZipCode('');
    setZipCodeTyped('');
  }

  useEffect(() => {
    // Save favorites to local storage whenever they change
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const navigateToFavorites = (): void => {
    router.push('/favorites');
  }

  return (
    <div>
      <header className="header py-6 px-4 mb-2 flex justify-between items-center bg-blue-500">
        <ul><a className="text-3xl font-bold text-white">Dog Finder</a></ul>
        <ul><a className="text-3xl font-bold text-white" onClick={navigateToFavorites}>Favorites</a></ul>
        <ul>
          <a onClick={logoutButton} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            Logout
          </a>
        </ul>
      </header>
      <main className="flex flex-col gap-8 items-center pb-4 px-4">
        <div className="flex gap-4 items-center">
          <select
            onChange={breedDropdownChange}
            value={selectedBreed || ''}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Breeds</option>
            {sortedBreeds.map((breed, index) => (
              <option key={index} value={breed}>{breed}</option>
            ))}
          </select>
          <span className="py-2 font-medium">Filter:</span>
          <select
            onChange={(e) => setSortField(e.target.value as 'breed' | 'name' | 'age')}
            value={sortField}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {!selectedBreed && <option value="breed">Breed</option>}
            <option value="name">Name</option>
            <option value="age">Age</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
          </button>
        </div>
        <div className="flex gap-4 items-center">
          <form onSubmit={zipCodeSubmit} className="flex gap-4 items-center">
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
              onClick={() => setZipCode(zipCodeTyped)}
            >
              Go
            </button>
            <button
              type="button"
              onClick={resetOnClick}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Reset
            </button>
          </form>
        </div>
        {searchResults && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map((dog) => (
              <div key={dog.id} className="border p-4 rounded shadow-lg hover:shadow-xl transition">
                <Image unoptimized priority={true} className="w-full h-auto rounded" src={dog.img} alt={dog.name} width={200} height={200} />
                <h3 className="text-xl font-bold mt-2">{dog.name}</h3>
                <button 
                  className="text-blue-500 hover:underline hover:font-bold"
                  onClick={() => breedPictureNameClick(dog.breed)}
                >
                  Breed: {dog.breed}
                </button>
                <p className="text-gray-700">Age: {dog.age}</p>
                <p className="text-gray-700">Location: {dog.city}, {dog.state}</p>
                <p className="text-gray-700">Zip Code: {dog.zip_code}</p>
                <button
                  onClick={() => toggleFavorite(dog.id)}
                  className={`mt-2 ml-14 px-4 py-2 rounded transition ${
                    favorites.includes(dog.id) ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {favorites.includes(dog.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            ))}
          </div>
        )}
        <button className="font-medium">Favorites: {favorites.length}</button>
        <button className="font-medium hover:underline" onClick={() => navigateToFavorites()}>View Favorites</button>
        <span className="py-4 font-medium">Page: {page + 1}</span>
        <div className="flex gap-4 mt-4 items-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-600 transition"
          >
            Previous Page
          </button>
          <span className="py-4 font-medium">Results per page:</span>
          <div className="flex gap-2">
            <button
              className={`px-1 ${resultsPerPage === 10 ? 'font-bold underline text-blue-500' : 'font-bold hover:underline hover:text-blue-500'}`}
              onClick={() => setResultsPerPage(10)}
            >
              10
            </button>
            <button
              className={`px-1 ${resultsPerPage === 25 ? 'font-bold underline text-blue-500' : 'font-bold hover:underline hover:text-blue-500'}`}
              onClick={() => setResultsPerPage(25)}
            >
              25
            </button>
            <button
              className={`px-1 ${resultsPerPage === 50 ? 'font-bold underline text-blue-500' : 'font-bold hover:underline hover:text-blue-500'}`}
              onClick={() => setResultsPerPage(50)}
            >
              50
            </button>
          </div>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Next Page
          </button>
          <button
            onClick={generateMatch}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            Generate Match
          </button>
        </div>
      </main>
    </div>
  );
}
