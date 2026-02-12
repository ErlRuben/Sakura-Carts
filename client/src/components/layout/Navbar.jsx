import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount } = useCart();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'text-sakura-400 bg-sakura-50'
        : 'text-dark hover:text-sakura-400 hover:bg-sakura-50'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sakura-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {/* Path starts from / because it is in the public folder */}
            <img src="/favicon.svg" alt="Sakura Logo" className="w-12 h-12" />
            <span className="text-xl font-bold">Sakura Carts</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={linkClass} end>Home</NavLink>
            <NavLink to="/shop" className={linkClass}>Shop</NavLink>
            <NavLink to="/request" className={linkClass}>Request</NavLink>
            <NavLink to="/faqs" className={linkClass}>FAQs</NavLink>
            <NavLink to="/contacts" className={linkClass}>Contacts</NavLink>
          </div>

          {/* Cart + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2 text-dark hover:text-sakura-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-sakura-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/admin" className={linkClass}>Account</Link>
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            <NavLink to="/" className={linkClass} end onClick={() => setMobileOpen(false)}>Home</NavLink>
            <NavLink to="/shop" className={linkClass} onClick={() => setMobileOpen(false)}>Shop</NavLink>
            <NavLink to="/request" className={linkClass} onClick={() => setMobileOpen(false)}>Request</NavLink>
            <NavLink to="/faqs" className={linkClass} onClick={() => setMobileOpen(false)}>FAQs</NavLink>
            <NavLink to="/contacts" className={linkClass} onClick={() => setMobileOpen(false)}>Contacts</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
