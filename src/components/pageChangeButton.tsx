export const PageChangeButton = ({
  page,
  onClick,
  text,
}: {
  onClick: () => void;
  page: number;
  text: string;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={text === "Previous Page" && page === 0}
      className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-600 transition"
    >
      {text}
    </button>
  );
};
