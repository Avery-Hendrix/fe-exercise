export const ZipCodeForm = ({
  zipCodeTyped,
  zipCodeOnChange,
  zipCodeOnSubmit,
  resetFilters,
}: {
  zipCodeTyped: string;
  zipCodeOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  zipCodeOnSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  resetFilters: () => void;
}) => {
  return (
    <form
      onSubmit={zipCodeOnSubmit}
      className="flex gap-4 items-center"
      role="form"
    >
      <input
        type="text"
        placeholder="ZIP Code"
        value={zipCodeTyped}
        onChange={zipCodeOnChange}
        className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        data-testid="submit-zip-code"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={resetFilters}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
      >
        Reset Location
      </button>
    </form>
  );
};
