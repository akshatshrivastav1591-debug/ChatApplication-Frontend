export function RecentMessageStyle({unreadCount}){
return (
    <div className="flex items-center gap-2 my-3 px-2">
      <div className="flex-1 h-px bg-gray-300" />
      <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
        {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
      </span>
      <div className="flex-1 h-px bg-gray-300" />
    </div>
  );
}
