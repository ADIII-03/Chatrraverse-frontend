import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, UsersIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Only fetch if user is logged in
    if (!authUser?.id) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/notifications/unreadCount", {
          headers: {
            Authorization: `Bearer ${authUser.token}`, // adjust token header as per your auth
          },
        });

        if (!response.ok) throw new Error("Failed to fetch unread count");

        const data = await response.json();
        setUnreadCount(data.count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUnreadCount();
  }, [authUser]);

  return (
  <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-300 flex items-center gap-2.5">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="text-2.9xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Chattraverse
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/"
          className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
            currentPath === "/"
              ? "bg-primary text-primary-content font-semibold"
              : "text-base-content hover:bg-primary hover:text-primary-content"
          }`}
        >
          <HomeIcon className="h-5 w-5" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
            currentPath === "/friends"
              ? "bg-primary text-primary-content font-semibold"
              : "text-base-content hover:bg-primary hover:text-primary-content"
          }`}
        >
          <UsersIcon className="h-5 w-5" />
          <span>Friends</span>
        </Link>

        <Link
          to="/notifications"
          className={`relative flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
            currentPath === "/notifications"
              ? "bg-primary text-primary-content font-semibold"
              : "text-base-content hover:bg-primary hover:text-primary-content"
          }`}
        >
          <BellIcon className="h-5 w-5" />
          <span>Notifications</span>

          {/* Notification Count Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary shadow-md">
              <img
                src={authUser?.profilePic || "/default-avatar.png"}
                alt="User Avatar"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm truncate max-w-[140px]">
              {authUser?.fullName || "Guest User"}
            </p>
            <p className="text-xs text-primary flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
