// frontend/src/components/layout/Navbar.jsx

import { NavLink } from "react-router-dom";
import { useAuth, useUser, UserButton, SignInButton } from "@clerk/clerk-react";

const navLinks = [
  { to: "/",        label: "Home",    icon: "🏠" },
  { to: "/library", label: "Library", icon: "📚" },
  { to: "/search",  label: "Search",  icon: "🔍" },
  { to: "/quiz",    label: "Quiz",    icon: "🧠" },
  { to: "/history", label: "History", icon: "🕐" },
];

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const { user }       = useUser();

  return (
    <>
      {/* ── Desktop Navbar ── */}
      <nav
        className="hidden md:flex items-center justify-between
                   px-8 h-16 sticky top-0 z-50
                   bg-white/80 backdrop-blur-xl
                   border-b border-surface-300"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 font-display
                     font-black text-xl tracking-tight group"
        >
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center
                       text-lg transition-transform duration-300
                       group-hover:scale-110 group-hover:rotate-3"
            style={{
              background: "linear-gradient(135deg, #6c63ff, #4c3de4)",
              boxShadow: "0 4px 12px rgba(108,99,255,0.3)",
            }}
          >
            🤟
          </span>
          <span style={{ color: "var(--ink)" }}>
            Sign<span style={{ color: "var(--brand)" }}>Learn</span>
          </span>
        </NavLink>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              style={{ animationDelay: `${i * 50}ms` }}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full text-sm
                 font-semibold transition-all duration-200 animate-fade-in ${
                  isActive
                    ? "nav-active"
                    : "text-ink-muted hover:text-ink hover:bg-surface-2"
                }`
              }
            >
              <span className="text-base">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <div
                className="text-sm font-medium px-3 py-1.5 rounded-full
                           animate-fade-in"
                style={{
                  background: "var(--surface-2)",
                  color: "var(--ink-muted)",
                }}
              >
                Hi, {user?.firstName || "there"} 👋
              </div>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-9 h-9 ring-2 ring-offset-2 ring-brand-500 transition-transform hover:scale-105",
                  },
                }}
              />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="btn-primary animate-fade-in">
                Sign In →
              </button>
            </SignInButton>
          )}
        </div>
      </nav>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50
                   bg-white/90 backdrop-blur-xl
                   border-t pb-safe"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2
                 rounded-2xl min-w-[56px] transition-all duration-200 ${
                  isActive ? "nav-active" : "text-ink-faint"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`text-xl transition-transform duration-200 ${
                      isActive ? "scale-110" : ""
                    }`}
                  >
                    {link.icon}
                  </span>
                  <span
                    className="text-[10px] font-bold"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  >
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          {/* Auth */}
          <div className="flex flex-col items-center gap-0.5 px-3 py-2
                          min-w-[56px]">
            {isSignedIn ? (
              <>
                <UserButton afterSignOutUrl="/" />
                <span
                  className="text-[10px] font-bold"
                  style={{ color: "var(--ink-faint)",
                           fontFamily: "DM Sans, sans-serif" }}
                >
                  Profile
                </span>
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="flex flex-col items-center gap-0.5">
                  <span className="text-xl">👤</span>
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: "var(--ink-faint)" }}
                  >
                    Sign In
                  </span>
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;