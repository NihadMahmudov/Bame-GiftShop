import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, Heart, LogOut, Settings } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { cartItemCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContainer}`}>
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={styles.logo}>
          <Link to="/">BAME<span>.</span></Link>
        </div>

        <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.active : ''}`}>
          <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => isActive ? styles.activeLink : ''}>
            Ana Səhifə
          </NavLink>
          <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => isActive ? styles.activeLink : ''}>
            Haqqımızda
          </NavLink>
          <NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => isActive ? styles.activeLink : ''}>
            Əlaqə
          </NavLink>
        </div>

        <div className={styles.navActions}>
          <button className={styles.iconBtn} aria-label="Search">
            <Search size={20} />
          </button>
          
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
              <User size={18} /> Giriş
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
