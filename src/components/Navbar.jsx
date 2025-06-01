import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, HomeIcon, UsersIcon, SearchIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";


const Navbar = () => {
  const { authUser, logout } = useAuthUser();
  const location = useLocation();

  // Check if current path is /chat/:id or starts with /chat/
  const isChatPage = location.pathname.startsWith("/chat/");

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center px-4 sm:px-6 lg:px-8">
      <div className="flex items-center w-full">
        {/* Show logo always on ChatPage, else only on small screens */}
        {(isChatPage || !isChatPage) && (
          <Link
            to="/"
            className={`flex items-center gap-2.5 ${
              isChatPage ? "" : "lg:hidden"
            }`}
          >
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            {/* No text per your request */}
          </Link>
        )}

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Search Icon */}
        <Link
          to="/search"
          className="btn btn-ghost btn-circle ml-3 inline-flex"
        >
          <SearchIcon className="h-6 w-6 text-base-content opacity-70" />
        </Link>

        {/* On ChatPage, show Home icon always */}
        {isChatPage && (
          <Link
            to="/"
            className="flex items-center gap-1 btn btn-ghost btn-sm mr-4"
          >
            <HomeIcon className="h-5 w-5" />
            Home
          </Link>
        )}

        {/* On mobile (sidebar hidden), show Friends button */}
        {!isChatPage && (
          <div className="flex gap-4 lg:hidden">
            <Link
              to="/friends"
              className={`flex items-center gap-1 btn btn-ghost btn-sm ${
                location.pathname === "/friends" ? "btn-active" : ""
              }`}
            >
              <UsersIcon className="h-5 w-5" />
              Friends
            </Link>
          </div>
        )}

        {/* Notifications */}
        <Link
          to="/notifications"
          className="btn btn-ghost btn-circle ml-3 hidden lg:inline-flex"
        >
          <BellIcon className="h-6 w-6 text-base-content opacity-70" />
        </Link>

        {/* Theme selector */}
        <ThemeSelector />

        {/* User avatar */}
        <div className="avatar ml-3">
          <div className="w-9 rounded-full">
            <img
              src={authUser?.profilePic}
              alt="User Avatar"
              rel="noreferrer"
            />
          </div>
        </div>

        {/* Logout button */}
        <button
          className="btn btn-ghost btn-circle ml-3"
          onClick={logout}
        >
          <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
