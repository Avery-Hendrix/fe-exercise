export const ResultsPerPageButton = ({
  resultsPerPage,
  setResultsPerPage,
}: {
  resultsPerPage: number;
  setResultsPerPage: (resultsPerPage: number) => void;
}) => {
  return (
    <div className="flex gap-2">
      <button
        className={`px-1 ${resultsPerPage === 10 ? "font-bold underline text-blue-500" : "font-bold hover:underline hover:text-blue-500"}`}
        onClick={() => setResultsPerPage(10)}
      >
        10
      </button>
      <button
        className={`px-1 ${resultsPerPage === 25 ? "font-bold underline text-blue-500" : "font-bold hover:underline hover:text-blue-500"}`}
        onClick={() => setResultsPerPage(25)}
      >
        25
      </button>
      <button
        className={`px-1 ${resultsPerPage === 50 ? "font-bold underline text-blue-500" : "font-bold hover:underline hover:text-blue-500"}`}
        onClick={() => setResultsPerPage(50)}
      >
        50
      </button>
    </div>
  );
};
