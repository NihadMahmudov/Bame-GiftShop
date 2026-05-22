import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Heart, ShoppingCart, Search, User as UserIcon, LogOut, Package, LayoutGrid } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import Shop from '../Shop/Shop';
import Cart from '../Cart/Cart';
import Wishlist from '../Wishlist/Wishlist';
import Orders from '../Orders/Orders';
import Categories from '../Categories/Categories';
import styles from './UserPanel.module.css';

const UserPanel = () => {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('kataloq');

  const TABS = [
    { id: 'kataloq', label: 'Kataloq', icon: <Store size={20} />, count: null },
    { id: 'categories', label: 'Kateqoriyalar', icon: <LayoutGrid size={20} />, count: null },
    { id: 'wishlist', label: 'Bəyəndiklərim', icon: <Heart size={20} />, count: wishlist.length },
    { id: 'cart', label: 'Səbətim', icon: <ShoppingCart size={20} />, count: cartItemCount },
    { id: 'orders', label: 'Sifarişlərim', icon: <Package size={20} />, count: null }
  ];

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.panelContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Link to="/">BAME<span>.</span></Link>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </div>

        <nav className={styles.navMenu}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className={styles.itemMain}>
                {tab.icon}
                {tab.label}
              </div>
              {tab.count > 0 && <span className={styles.badge}>{tab.count}</span>}
            </button>
          ))}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={18} /> Çıxış
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={styles.tabWrapper}
          >
            {activeTab === 'kataloq' && <Shop inPanel={true} />}
            {activeTab === 'categories' && <Categories inPanel={true} />}
            {activeTab === 'wishlist' && <Wishlist inPanel={true} />}
            {activeTab === 'cart' && <Cart inPanel={true} />}
            {activeTab === 'orders' && <Orders />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default UserPanel;
