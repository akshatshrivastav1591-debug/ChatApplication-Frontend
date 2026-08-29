export function OptionsForUser({
  onChat,
  onViewProfilePicture,
  onEditContact,
}) {
  return (
    <>
      <ul className="bg-blue-100 w-40 rounded-xl overflow-hidden divide-y divide-blue-200">
        <li
          className="font-bold text-blue-400 active:bg-blue-200 px-3 py-2.5"
          onClick={onChat}
        >
          Message{}
        </li>
        <li
          className="font-bold text-blue-400 active:bg-blue-200 px-3 py-2.5"
          onClick={onViewProfilePicture}
        >
          View Profile picture
        </li>

        <li
          className="font-bold text-blue-400 active:bg-blue-200 px-3 py-2.5"
          onClick={onEditContact}
        >
          Edit Contact
        </li>
      </ul>
    </>
  );
}