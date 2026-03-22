// frontend/src/components/layout/Layout.jsx

import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";

const Layout = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main
        key={pathname} // Re-trigger animation on route change
        className="flex-1 max-w-7xl mx-auto w-full
                   px-4 sm:px-6 lg:px-8 py-8
                   pb-28 md:pb-8 animate-fade-up"
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="hidden md:block mt-auto py-5 px-8"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-md flex items-center
                         justify-center text-xs"
              style={{
                background: "linear-gradient(135deg, #6c63ff, #4c3de4)",
              }}
            >
              🤟
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--ink-muted)" }}
            >
              SignLearn — Smart India Hackathon 2024
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;