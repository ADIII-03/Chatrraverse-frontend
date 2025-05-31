import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen" data-theme="mytheme">
      <div className="flex">
        {/* Desktop sidebar */}
        {showSidebar && (
          <div className="hidden lg:flex">
            <Sidebar />
          </div>
        )}

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={closeSidebar}
          >
            <div
              className="absolute inset-0 bg-black opacity-50"
              aria-hidden="true"
            ></div>
            <div
              className="relative w-64 bg-base-200 h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <Navbar
            showSidebar={showSidebar}
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
