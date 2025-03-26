import Image from "next/image";
import { Dog } from "../constants/constants";

export default function SearchResultsRender({
  dog,
  setSelectedBreed,
  setPage,
  setFavorites,
  favorites,
}: {
  dog: Dog;
  setSelectedBreed: (breed: string) => void;
  setPage: (page: number) => void;
  setFavorites: (
    favorites: string[] | ((prevFavorites: string[]) => string[]),
  ) => void;
  favorites: string[];
}) {
  const breedPictureNameClick = (breed: string) => {
    setSelectedBreed(breed);
    setPage(0);
  };
  const toggleFavorite = (dogId: string) => {
    setFavorites((prevFavorites: string[]) =>
      prevFavorites.includes(dogId)
        ? prevFavorites.filter((id: string) => id !== dogId)
        : [...prevFavorites, dogId],
    );
  };
  return (
    <div
      key={dog.id}
      className="border p-4 rounded shadow-lg hover:shadow-xl transition"
    >
      <div className="relative w-full h-0 pb-[75%]">
        <Image
          unoptimized
          priority
          className="rounded absolute top-0 left-0 w-full h-full object-cover"
          src={dog.img}
          alt={dog.name}
          fill
        />
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-center sm:items-start">
        <h3 className="text-xl font-bold mt-2 text-center sm:text-left">
          {dog.name}
        </h3>
        <button
          className="text-blue-500 hover:underline hover:font-bold mt-2"
          onClick={() => breedPictureNameClick(dog.breed)}
        >
          Breed: {dog.breed}
        </button>
        <p className="text-gray-700 mt-2">Age: {dog.age}</p>
        <p className="text-gray-700">
          Location: {dog.city}, {dog.state}
        </p>
        <p className="text-gray-700">Zip Code: {dog.zip_code}</p>
        <button
          onClick={() => toggleFavorite(dog.id)}
          className={`mt-4 px-4 py-2 rounded transition ${
            favorites.includes(dog.id)
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {favorites.includes(dog.id)
            ? "Remove from Favorites"
            : "Add to Favorites"}
        </button>
      </div>
    </div>
  );
}
