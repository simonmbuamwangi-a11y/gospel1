import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

type DropdownItem = { href: string; label: string };
type NavLink = { href: string; label: string; children?: DropdownItem[] };

const navLinks: NavLink[] = [
  { href: '/',            label: 'Home' },
  { href: '/about',       label: 'About' },
  { href: '/devotionals', label: 'Devotionals' },
  {
    href: '/books',
    label: 'Books',
    children: [
      { href: '/books', label: 'All Books' },
      { href: '/books?age=adult', label: 'Adult Edition' },
      { href: '/books?age=teen', label: 'Teen Edition' },
      { href: '/books?age=kids', label: "Kids Edition" },
    ],
  },
  {
    href: '/prayer-guidelines',
    label: 'Resources',
    children: [
      { href: '/prayer-guidelines', label: 'Prayer Guidelines' },
      { href: '/prayer-partners',   label: 'Prayer Partners' },
      { href: '/free-sample',       label: 'Free Sample' },
    ],
  },
  { href: '/blog',        label: 'Blog' },
  {
    href: '/communities',
    label: 'Community',
    children: [
      { href: '/communities',      label: 'Communities' },
      { href: '/prayer-partners',  label: 'Prayer Partners' },
    ],
  },
  { href: '/donate',  label: 'Donate' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const pathname = location.pathname;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setOpenDropdown(null); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function handleEnter(key: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(key);
  }
  function handleLeave() {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  }

  const isActive = (href: string) => {
    const clean = href.split('?')[0];
    return pathname === clean;
  };

  return (
    <header
      role="banner"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-400 ${
        scrolled ? 'glass-nav py-2 shadow-glass' : 'bg-transparent py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo — ~210px wide */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0" aria-label="In Him Daily — home">
            <div className={`relative flex-shrink-0 transition-all duration-400 ${scrolled ? 'w-9 h-9' : 'w-11 h-11'}`}>
              <img
                src="/images/733127106_122096833941384062_9064072413288732878_n.jpg"
                alt="In Him Daily logo"
                className="w-full h-full object-contain drop-shadow group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="leading-tight" style={{ width: '160px' }}>
              <p className={`font-playfair font-bold transition-all duration-400 ${scrolled ? 'text-white text-[1.05rem]' : 'text-white text-[1.15rem]'}`}>
                In Him <em className="not-italic text-gold-400">Daily</em>
              </p>
              <p className={`text-[0.6rem] tracking-[0.15em] uppercase transition-all duration-400 ${scrolled ? 'text-gold-300/70' : 'text-white/60'}`}>
                Hidden with Christ in God
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              if (link.children) {
                const key = link.label;
                return (
                  <div
                    key={key}
                    className="relative"
                    onMouseEnter={() => handleEnter(key)}
                    onMouseLeave={handleLeave}
                  >
                    <Link
                      to={link.href}
                      className={`relative px-3 py-2 text-[0.8rem] font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                        active
                          ? 'text-gold-300 bg-white/10'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                      aria-current={active ? 'page' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openDropdown === key}
                    >
                      {link.label}
                      <ChevronDown size={12} className={`transition-transform duration-200 ${openDropdown === key ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </Link>
                    {openDropdown === key && (
                      <div className="absolute top-full left-0 mt-1 min-w-[200px] rounded-xl glass-nav border border-gold-100/20 shadow-glass overflow-hidden animate-fade-in">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={`block px-4 py-2.5 text-[0.8rem] font-medium transition-colors ${
                              isActive(child.href)
                                ? 'text-gold-300 bg-white/10'
                                : 'text-white/75 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-3 py-2 text-[0.8rem] font-medium rounded-lg transition-all duration-200 ${
                    active
                      ? 'text-gold-300 bg-white/10'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Shop Now CTA */}
          <div className="hidden xl:flex">
            <Link
              to="/books"
              className="px-5 py-2.5 text-[0.8rem] font-semibold rounded-full bg-gold-500 text-[#05070D] hover:bg-gold-400 shadow-gold transition-all duration-300 hover:-translate-y-px"
            >
              Shop Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="xl:hidden p-2 rounded-lg transition-colors text-white hover:bg-white/10"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav
          aria-label="Mobile navigation"
          className="glass-nav border-t border-gold-100/20 px-4 pb-5 pt-3 space-y-0.5"
        >
          {navLinks.map((link) => (
            <div key={link.label}>
              <Link
                to={link.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive(link.href)
                    ? 'text-gold-300 bg-white/10 font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
              {link.children && (
                <div className="pl-4 space-y-0.5">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      className={`block px-4 py-2.5 text-[0.82rem] rounded-lg transition-colors ${
                        isActive(child.href)
                          ? 'text-gold-300 bg-white/10'
                          : 'text-white/55 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-3">
            <Link
              to="/books"
              className="block text-center px-5 py-3 bg-gold-500 text-[#05070D] text-sm font-semibold rounded-full hover:bg-gold-400 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
