import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Heart, LogOut, Settings, Sun, Moon, Home, Compass, Package } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { cartItemCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout, isAdmin } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  const handleLogout = () => {
    logout();
    setIsDrawerOpen(false);
    navigate('/');
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  const navLinks = [
    { to: '/', label: 'Ana Səhifə', icon: <Home size={20} /> },
    { to: '/categories', label: 'Kateqoriyalar', icon: <Compass size={20} /> },
    { to: '/shop', label: 'Mağaza', icon: <ShoppingBag size={20} /> },
    { to: '/about', label: 'Haqqımızda', icon: <User size={20} /> },
    { to: '/contact', label: 'Əlaqə', icon: <Package size={20} /> },
  ];

  return (
    <>
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.navContainer}`}>
          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Menyunu aç"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <div className={styles.logo}>
            <Link to="/">BAME<span>.</span></Link>
          </div>

          {/* Desktop Nav Links */}
          <div className={styles.navLinks}>
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => isActive ? styles.activeLink : ''}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className={styles.navActions}>
            {/* Theme Toggle */}
            <button className={styles.iconBtn} onClick={toggleTheme} title={isDarkMode ? 'İşıqlı Rejim' : 'Qaranlıq Rejim'}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Wishlist */}
            <button className={styles.iconBtn} onClick={() => navigate('/wishlist')} aria-label="Bəyəndiklərim">
              <Heart size={20} />
              {wishlist.length > 0 && <span className={styles.cartCount}>{wishlist.length}</span>}
            </button>

            {/* Cart */}
            <button className={styles.iconBtn} onClick={() => navigate('/cart')} aria-label="Səbət">
              <ShoppingBag size={20} />
              {cartItemCount > 0 && <span className={styles.cartCount}>{cartItemCount}</span>}
            </button>

            {/* User */}
            {user ? (
              <div className={styles.userMenu}>
                <span className={styles.userName}>{user.name}</span>
                {isAdmin && (
                  <Link to="/dashboard" className={styles.adminBtn} title="Admin Panel">
                    <Settings size={20} />
                  </Link>
                )}
                <button onClick={handleLogout} className={styles.logoutBtn} title="Çıxış">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className={styles.loginBtn}>
                <User size={16} /> Giriş
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`${styles.drawerOverlay} ${isDrawerOpen ? styles.overlayVisible : ''}`}
        onClick={closeDrawer}
      />

      {/* Mobile Side Drawer */}
      <aside className={`${styles.mobileDrawer} ${isDrawerOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerLogo}>BAME<span>.</span></div>
          <button className={styles.drawerClose} onClick={closeDrawer}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.drawerNav}>
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeDrawer}
              className={({ isActive }) =>
                `${styles.drawerLink} ${isActive ? styles.drawerActive : ''}`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}

          <button
            className={styles.drawerLink}
            onClick={() => { toggleTheme(); closeDrawer(); }}
            style={{ border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            {isDarkMode ? 'İşıqlı Rejim' : 'Qaranlıq Rejim'}
          </button>
        </nav>

        <div className={styles.drawerFooter}>
          {user ? (
            <>
              <div className={styles.drawerUser}>
                <div className={styles.drawerAvatar}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.drawerUserInfo}>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
              </div>
              {isAdmin && (
                <Link to="/dashboard" onClick={closeDrawer} className={styles.drawerLoginBtn}>
                  <Settings size={18} /> Admin Panel
                </Link>
              )}
              <button className={styles.drawerLogout} onClick={handleLogout}>
                <LogOut size={18} /> Çıxış
              </button>
            </>
          ) : (
            <Link to="/login" onClick={closeDrawer} className={styles.drawerLoginBtn}>
              <User size={18} /> Giriş / Qeydiyyat
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
