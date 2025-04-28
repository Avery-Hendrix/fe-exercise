import { Dog } from "@/src/constants";

export const MatchModal = ({
  modalMatch,
  setModalOpen,
}: {
  modalMatch: Dog[] | undefined | null;
  setModalOpen: (open: boolean) => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Match Result</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {modalMatch?.map((dog) => (
            <div key={dog.id} className="flex flex-col items-center">
              <img
                src={dog.img}
                alt={dog.name}
                className="rounded-full w-32 h-32"
              />
              <h3 className="text-xl font-bold">{dog.name}</h3>
              <p className="text-gray-700">Breed: {dog.breed}</p>
              <p className="text-gray-700">Age: {dog.age}</p>
              <p className="text-gray-700">
                Location: {dog.city}, {dog.state}
              </p>
              <p className="text-gray-700">Zip Code: {dog.zip_code}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => setModalOpen(false)}
          className="mt-6 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition block mx-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
};
