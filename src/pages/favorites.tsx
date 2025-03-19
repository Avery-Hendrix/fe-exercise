'use client';

import { useRouter } from 'next/navigation';
import { baseURL } from '../components/constants';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import '../_app/globals.css';

export default function Favorites() {
    const [arrayOfFavorites, setArrayOfFavorites] = useState<string[]>([]);
    const [arrayOfDogs, setArrayOfDogs] = useState<any[]>([]);
    const router = useRouter();

    const logoutButton = async () => {
        try {
            const response = await fetch(`${baseURL}/auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                router.push('/');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const searchDogs = async (dogIds: string[]) => {
        try {
            const response = await fetch(`${baseURL}/dogs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(dogIds),
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status} - ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching dogs:', error);
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
        if (typeof window !== 'undefined') {
            const storedFavorites = localStorage.getItem('favorites');
            setArrayOfFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('favorites', JSON.stringify(arrayOfFavorites));
        }
    }, [arrayOfFavorites]);

    const toggleFavorite = (id: string) => {
        setArrayOfFavorites((prevFavorites) =>
            prevFavorites.includes(id)
                ? prevFavorites.filter((favorite) => favorite !== id)
                : [...prevFavorites, id]
        );
    };

    return (
        <div>
            <header className="header py-6 px-4 mb-2 flex justify-between items-center bg-blue-500">
                <ul>
                    <a className="text-3xl font-bold text-white" href="/home">
                        Dog Finder
                    </a>
                </ul>
                <ul>
                    <a className="text-3xl font-bold text-white" href="/favorites">
                        Favorites
                    </a>
                </ul>
                <ul>
                    <a
                        onClick={logoutButton}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
                    >
                        Logout
                    </a>
                </ul>
            </header>
            <main className="py-6 px-4">
                <h1 className="text-3xl font-bold mb-4">Favorites</h1>
                <div>
                    {arrayOfFavorites.length ? (
                        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
                            {arrayOfDogs.map((favorite) => (
                                <div
                                    key={favorite.id}
                                    className="border p-4 rounded shadow-lg hover:shadow-xl transition"
                                >
                                    <Image
                                        unoptimized
                                        priority
                                        className="w-full h-auto rounded"
                                        src={favorite.img}
                                        alt={favorite.name}
                                        width={200}
                                        height={200}
                                    />
                                    <h3 className="text-xl font-bold mt-2">{favorite.name}</h3>
                                    <p className="text-gray-700">Breed: {favorite.breed}</p>
                                    <p className="text-gray-700">Age: {favorite.age}</p>
                                    <p className="text-gray-700">
                                        Location: {favorite.city}, {favorite.state}
                                    </p>
                                    <p className="text-gray-700">Zip Code: {favorite.zip_code}</p>
                                    <button
                                        onClick={() => toggleFavorite(favorite.id)}
                                        className={`mt-2 ml-14 px-4 py-2 rounded transition ${
                                            arrayOfFavorites.includes(favorite.id)
                                                ? 'bg-red-500 text-white hover:bg-red-600'
                                                : 'bg-green-500 text-white hover:bg-green-600'
                                        }`}
                                    >
                                        {arrayOfFavorites.includes(favorite.id)
                                            ? 'Remove from Favorites'
                                            : 'Add to Favorites'}
                                    </button>
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
