import Image from "next/image";

export default function Header({ navigateToHome, navigateToFavorites, logoutButton }: {
    navigateToHome?: () => void;
    navigateToFavorites?: () => void;
    logoutButton: () => void
}) {
  return (
    <header className="header py-6 px-4 mb-2 flex justify-between items-center bg-purple-900">
      <ul>
        <Image
          unoptimized
          priority={true}
          className="rounded"
          src={'Fetch_idhiN4Hl3a_0.svg'}
          alt={'dog.name'}
          width={75}
          height={75}
        />
      </ul>
      <ul>
        <a
          className="text-3xl font-bold text-white ml-90"
          onClick={navigateToHome}
        >
          Dog Finder
        </a>
      </ul>
      <ul>
        <a
          className="text-3xl font-bold text-white ml-60"
          onClick={navigateToFavorites}
        >
          Favorites
        </a>
      </ul>
      <ul>
        <a
          className="logout-button text-white px-4 py-2 rounded transition"
          onClick={logoutButton}
        >
          Logout
        </a>
      </ul>
    </header>
  );
};