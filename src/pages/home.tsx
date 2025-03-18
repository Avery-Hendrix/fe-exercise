'use client'
import { baseURL, Dog } from "@/src/components/constants";
import Image from "next/image";
import { useEffect, useState } from "react";
import '../_app/globals.css'
import { useRouter } from "next/navigation";

interface Match {
  match: string;
}

interface Coordinates {
  lat: number;
  lon: number;
}

interface Location {
  // Define the properties of a Location object here
}

export default function Home() {
  const router = useRouter();
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<'breed' | 'name' | 'age'>('breed');
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');

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

  useEffect(() => {
    const fetchSearchResults = async () => {
      const results = await searchDogs({
        breeds: selectedBreed ? [selectedBreed] : [dogBreeds.map((breed) => breed)],
        size: 10,
        from: page * 10,
        sort: `${sortField}:${sortOrder}`,
        zipCode: zipCode || undefined,
        city: city || undefined,
        state: state ? [state] : undefined,
      });
      setSearchResults(results);
    };
    fetchSearchResults();
  }, [selectedBreed, page, sortOrder, sortField, zipCode, city, state]);

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
      console.log(match, 'match');
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

  const searchLocations = async (queryParams: {
    city?: string,
    states?: string[],
    geoBoundingBox?: {
      top?: number,
      left?: number,
      bottom?: number,
      right?: number,
      bottom_left?: Coordinates,
      top_left?: Coordinates
    },
    size?: number,
    from?: number
  }) => {
    try {
      const response = await fetch(baseURL + '/locations/search', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(queryParams),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status} - ${response.statusText}`);
      }
      return response.json();
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

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dog Finder</h1>
        <button onClick={logoutButton} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </header>
      <main className="flex flex-col gap-8 items-center">
        <div className="flex gap-4">
          <select
            onChange={(e) => setSelectedBreed(e.target.value)}
            value={selectedBreed || ''}
            className="border p-2 rounded"
          >
            <option value="">All Breeds</option>
            {sortedBreeds.map((breed, index) => (
              <option key={index} value={breed}>{breed}</option>
            ))}
          </select>
          <select
            onChange={(e) => setSortField(e.target.value as 'breed' | 'name' | 'age')}
            value={sortField}
            className="border p-2 rounded"
          >
            {!selectedBreed && <option value="breed">Breed</option>}
            {selectedBreed && <><option value="name">Name</option>
            <option value="age">Age</option></>}
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
          </button>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="ZIP Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="border p-2 rounded"
            onSubmit={() => postLocations([zipCode])}
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border p-2 rounded"
            onSubmit={() => searchLocations({ city })}
          />
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border p-2 rounded"
            onSubmit={() => searchLocations({ states: [state] })}
          />
        </div>
        {!selectedBreed && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedBreeds.map((breed, index) => (
              <button
                className="border p-4 rounded shadow-lg font-bold"
                key={index}
                onClick={() => setSelectedBreed(breed)}>
                  {breed}
              </button>
            ))}
          </div>
        )}
        {searchResults && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map((dog) => (
              <div key={dog.id} className="border p-4 rounded shadow-lg">
                <Image unoptimized src={dog.img} alt={dog.name} width={200} height={200} />
                <h3 className="text-xl font-bold mt-2">{dog.name}</h3>
                <p className="text-gray-700">Breed: {dog.breed}</p>
                <p className="text-gray-700">Age: {dog.age}</p>
                <p className="text-gray-700">Zip Code: {dog.zip_code}</p>
                <button
                  onClick={() => toggleFavorite(dog.id)}
                  className={`mt-2 px-4 py-2 rounded ${favorites.includes(dog.id) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                >
                  {favorites.includes(dog.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        <button
          onClick={generateMatch}
          className="bg-purple-500 text-white px-4 py-2 rounded mt-4"
        >
          Generate Match
        </button>
        </div>
      </main>
    </div>
  );
}
