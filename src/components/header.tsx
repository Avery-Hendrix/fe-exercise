import Image from "next/image";

export const Header = ({
  navigateToHome,
  navigateToFavorites,
  logoutButton,
}: {
  navigateToHome?: () => void;
  navigateToFavorites?: () => void;
  logoutButton: () => void;
}) => {
  return (
    <header className="header py-4 px-4 mb-2 flex flex-wrap items-center bg-purple-900">
      <div className="flex-shrink-0 flex items-center">
        <Image
          unoptimized
          priority={true}
          className="rounded"
          src={"Fetch_idhiN4Hl3a_0.svg"}
          alt={"dog.name"}
          width={50}
          height={50}
        />
        <a
          className="ml-4 text-xl font-bold text-white sm:text-3xl"
          onClick={navigateToHome}
        >
          Dog Fetcher
        </a>
      </div>
      <div className="flex-grow text-center mt-4 sm:mt-0 sm:text-right">
        <a
          className="text-lg font-bold text-white sm:text-2xl mr-4"
          onClick={navigateToFavorites}
        >
          View Favorites
        </a>
        <a
          className="logout-button text-white px-4 py-2 rounded transition bg-purple-700 hover:bg-purple-600 text-sm sm:text-base"
          onClick={logoutButton}
        >
          Logout
        </a>
      </div>
    </header>
  );
};
