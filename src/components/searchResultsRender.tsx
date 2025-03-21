import Image from "next/image";
import { Dog } from "./constants";

export default function SearchResultsRender({
    dog,
    setSelectedBreed,
    setPage,
    setFavorites,
    favorites
} : {
    dog: Dog;
    setSelectedBreed: (breed: string) => void;
    setPage: (page: number) => void;
    setFavorites: (favorites: string[] | ((prevFavorites: string[]) => string[])) => void;
    favorites: string[];
}) {
    const breedPictureNameClick = (breed: string) => {
        setSelectedBreed(breed)
        setPage(0)
    }
    const toggleFavorite = (dogId: string) => {
        setFavorites((prevFavorites: string[]) =>
            prevFavorites.includes(dogId)
                ? prevFavorites.filter((id: string) => id !== dogId)
                : [...prevFavorites, dogId]
        );
    };
    return (
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
                className={
                    `mt-2 ml-14 px-4 py-2 rounded transition ${
                    favorites.includes(dog.id) ? 'bg-red-500 text-white hover:bg-red-600' :
                    'bg-green-500 text-white hover:bg-green-600'}`
                }
            >
                {favorites.includes(dog.id) ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
        </div>
    )
}