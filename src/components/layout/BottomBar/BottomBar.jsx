import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, ShoppingBag, User, Heart } from 'lucide-react';
import styles from './BottomBar.module.css';

const BottomBar = () => {
  return (
    <nav className={styles.bottomBar}>
      <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
        <Home size={24} />
        <span>Ana Səhifə</span>
      </NavLink>
      <NavLink to="/shop" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
        <Compass size={24} />
        <span>Kəşf Et</span>
      </NavLink>
      <NavLink to="/wishlist" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
        <Heart size={24} />
        <span>Bəyənilənlər</span>
      </NavLink>
      <NavLink to="/cart" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
        <div className={styles.cartIconWrapper}>
          <ShoppingBag size={24} />
          <span className={styles.badge}>0</span>
        </div>
        <span>Səbət</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
        <User size={24} />
        <span>Profil</span>
      </NavLink>
    </nav>
  );
};

export default BottomBar;
