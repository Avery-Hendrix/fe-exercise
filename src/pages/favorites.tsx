"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Header } from "@/src/components";
import { baseURL } from "@/src/constants";

import "../_app/globals.css";

export default function Favorites() {
  const [arrayOfFavorites, setArrayOfFavorites] = useState<string[]>([]);
  const [arrayOfDogs, setArrayOfDogs] = useState<any[]>([]);
  const router = useRouter();

  const logoutButton = async () => {
    try {
      const response = await fetch(`${baseURL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const searchDogs = async (dogIds: string[]) => {
    try {
      const response = await fetch(`${baseURL}/dogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dogIds),
      });

      if (!response.ok) {
        throw new Error(
          `Response status: ${response.status} - ${response.statusText}`,
        );
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching dogs:", error);
    }
  };

  useEffect(() => {
    const fetchDogs = async () => {
      if (arrayOfFavorites.length) {
        const dogsResponse = await searchDogs(arrayOfFavorites);
        setArrayOfDogs(dogsResponse || []);
      }
    };

    fetchDogs();
  }, [arrayOfFavorites]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem("favorites");
      setArrayOfFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(arrayOfFavorites));
    }
  }, [arrayOfFavorites]);

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

  const toggleFavorite = (id: string) => {
    setArrayOfFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favorite) => favorite !== id)
        : [...prevFavorites, id],
    );
  };
  const navigateToHome = (): void => {
    router.push("/home");
  };

  useEffect(() => {
    const fetchLocations = async () => {
      if (arrayOfDogs.length) {
        const locationsResponse = await postLocations(
          arrayOfDogs.map((dog) => dog.zip_code),
        );
        if (locationsResponse) {
          const updatedDogs = arrayOfDogs.map((dog) => {
            const location = locationsResponse.find(
              (loc: any) => loc.zip_code === dog.zip_code,
            );
            return location
              ? { ...dog, city: location.city, state: location.state }
              : dog;
          });
          setArrayOfDogs((prevDogs) => {
            const isSame =
              JSON.stringify(prevDogs) === JSON.stringify(updatedDogs);
            return isSame ? prevDogs : updatedDogs;
          });
        }
      }
    };
    fetchLocations();
  }, [arrayOfDogs]);

  return (
    <div>
      <Header logoutButton={logoutButton} navigateToHome={navigateToHome} />
      <main className="py-6 px-4">
        <h1 className="text-3xl font-bold mb-4">Favorites</h1>
        <div>
          {arrayOfFavorites.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {arrayOfDogs.map((favorite) => (
                <div
                  key={favorite.id}
                  className="border p-4 rounded shadow-lg hover:shadow-xl transition"
                >
                  <div className="relative w-full h-0 pb-[75%]">
                    <Image
                      unoptimized
                      priority
                      className="rounded absolute top-0 left-0 w-full h-full object-cover"
                      src={favorite.img}
                      alt={favorite.name}
                      fill
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-xl font-bold">{favorite.name}</h3>
                    <p className="text-gray-700">Breed: {favorite.breed}</p>
                    <p className="text-gray-700">Age: {favorite.age}</p>
                    <p className="text-gray-700">
                      Location: {favorite.city}, {favorite.state}
                    </p>
                    <p className="text-gray-700">
                      Zip Code: {favorite.zip_code}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => toggleFavorite(favorite.id)}
                      className={`px-4 py-2 rounded ${
                        arrayOfFavorites.includes(favorite.id) &&
                        "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      {arrayOfFavorites.includes(favorite.id) &&
                        "Remove from Favorites"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg">You have no favorites yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
