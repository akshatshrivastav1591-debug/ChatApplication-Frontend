export function DateFeedFunction({ SendingDate }) {
  const formatted = new Date(SendingDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  return (
    <>
      <div className="flex justify-center">
        <div className=" flex  bg-blue-500  gap-1 border-black rounded-md font-bold  p-1 m-1  text-white">
          <div className="ml-1">{formatted}</div>
        </div>
      </div>
    </>
  );
}
