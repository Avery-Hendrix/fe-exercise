export const CityStateForm = ({
  location,
  setLocation,
  getSearchLocations,
  handleFindMyLocation,
}: {
  location: { city: string; state: string };
  setLocation: (location: { city: string; state: string }) => void;
  getSearchLocations: () => void;
  handleFindMyLocation: () => void;
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setLocation({ city: location.city, state: location.state });
        getSearchLocations();
      }}
      className="flex gap-4 items-center"
    >
      <input
        type="text"
        placeholder="City"
        value={location.city}
        onChange={(e) =>
          setLocation({
            ...location,
            city: e.target.value.toUpperCase(),
          })
        }
        className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="State"
        value={location.state}
        onChange={(e) =>
          setLocation({
            ...location,
            state: e.target.value.toUpperCase(),
          })
        }
        className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        data-testid="submit-location"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={handleFindMyLocation}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Find My Location
      </button>
    </form>
  );
};
