import Image from "next/image";

export default function Header({
  navigateToHome,
  navigateToFavorites,
  logoutButton,
}: {
  navigateToHome?: () => void;
  navigateToFavorites?: () => void;
  logoutButton: () => void;
}) {
  return (
    <header className="header py-6 px-4 mb-2 flex items-center bg-purple-900">
      <ul className="flex-shrink-0">
        <Image
          unoptimized
          priority={true}
          className="rounded"
          src={"Fetch_idhiN4Hl3a_0.svg"}
          alt={"dog.name"}
          width={75}
          height={75}
        />
      </ul>
      <ul className="flex-grow text-center">
        <a className="text-3xl font-bold text-white" onClick={navigateToHome}>
          Dog Fetcher
        </a>
      </ul>
      <ul className="flex-shrink-0 flex items-center space-x-4">
        <a
          className="text-3xl font-bold text-white"
          onClick={navigateToFavorites}
        >
          View Favorites
        </a>
        <a
          className="logout-button text-white px-4 py-2 rounded transition"
          onClick={logoutButton}
        >
          Logout
        </a>
      </ul>
    </header>
  );
}
