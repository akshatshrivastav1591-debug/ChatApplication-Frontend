export function ErrorComponent({ closingFunction, message, title }) {
  return (
    <div
      className="bg-white w-72 rounded-xl p-4 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="font-bold text-base text-gray-800">{title}</h2>
      {message ? <p className="text-sm text-gray-500 mt-1">{message}</p> : null}

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={closingFunction}
          className="px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
