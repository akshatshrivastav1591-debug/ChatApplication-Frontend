export function ConfirmationModal({
  isOpen,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white w-72 max-w-[90vw] rounded-xl p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-bold text-base text-gray-800">{title}</h2>
        {message ? (
          <p className="text-sm text-gray-500 mt-1">{message}</p>
        ) : null}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onCancel}
            className="px-3 py-2 rounded-lg text-sm font-bold text-gray-600 active:bg-gray-200 sm:hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-2 rounded-lg text-sm font-bold text-white bg-red-500 active:bg-red-700 sm:hover:bg-red-600 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}