import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const NAV_LINKS = [
  { label: "New Arrivals", to: "/shop?sort=newest" },
  { label: "Outerwear", to: "/shop?category=outerwear" },
  { label: "Tops", to: "/shop?category=tops" },
  { label: "Bottoms", to: "/shop?category=bottoms" },
  { label: "Accessories", to: "/shop?category=accessories" },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-line">
      <div className="max-w-content mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <button
            className="md:hidden text-ink"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M2 6h18M2 11h18M2 16h18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          <Link to="/" className="font-display text-2xl tracking-tight">
            Clothify
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm text-ink/80 hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="text-sm text-ink/80 hover:text-ink transition-colors"
              >
                {user ? user.name.split(" ")[0] : "Account"}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-paper border border-line shadow-lg py-2">
                  {user ? (
                    <>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm hover:bg-stone"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm hover:bg-stone"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                          navigate("/");
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-stone"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm hover:bg-stone"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-sm hover:bg-stone"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Create account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link to="/cart" className="relative flex items-center text-ink" aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M4 6h14l-1.2 10.5a1.5 1.5 0 01-1.5 1.3H6.7a1.5 1.5 0 01-1.5-1.3L4 6z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path d="M7.5 6V4.5a3.5 3.5 0 017 0V6" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rust text-paper text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm text-ink/80"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
