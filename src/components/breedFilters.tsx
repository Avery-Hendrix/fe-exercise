export const BreedFilters = ({
  setSelectedBreed,
  setSortField,
  setSortOrder,
  resetFilters,
  dogBreeds,
  selectedBreed,
  setPage,
  sortField,
  sortOrder,
}: {
  setSelectedBreed: (breed: string) => void;
  setSortField: (field: "breed" | "name" | "age") => void;
  setSortOrder: (order: "asc" | "desc") => void;
  resetFilters: () => void;
  dogBreeds: string[];
  selectedBreed: string | null;
  setPage: (page: number) => void;
  sortField: "breed" | "name" | "age";
  sortOrder: "asc" | "desc";
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      <select
        onChange={(e) => {
          setSelectedBreed(e.target.value);
          setPage(0);
        }}
        value={selectedBreed || ""}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Breed Selector"
      >
        <option value="">All Breeds</option>
        {dogBreeds.map((breed, index) => (
          <option key={index} value={breed}>
            {breed}
          </option>
        ))}
      </select>
      <span className="py-2 font-medium">Filter:</span>
      <select
        onChange={(e) =>
          setSortField(e.target.value as "breed" | "name" | "age")
        }
        value={sortField}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Sort Field"
      >
        <option value="breed">Breed</option>
        <option value="name">Name</option>
        <option value="age">Age</option>
      </select>
      <button
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
      </button>
      <button
        type="button"
        onClick={resetFilters}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
      >
        Reset Filters
      </button>
    </div>
  );
};
