import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, PlusCircle, Trash2,
  LogOut, Store, TrendingUp, ShoppingBag, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { categories } from '../../data/products';
import styles from './Dashboard.module.css';

const TABS = ['Məhsullarım', 'Məhsul Əlavə Et'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { products, addProduct, deleteProduct } = useProducts();
  const [activeTab, setActiveTab] = useState('Məhsullarım');
  const [form, setForm] = useState({
    name: '', price: '', oldPrice: '', category: 'decor',
    img: '', description: ''
  });
  const [success, setSuccess] = useState(false);

  // Redirect if not logged in or not admin
  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.price || !form.img) return;
    addProduct({
      name: form.name,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      category: form.category,
      img: form.img,
    });
    setForm({ name: '', price: '', oldPrice: '', category: 'decor', img: '', description: '' });
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setActiveTab('Məhsullarım'); }, 1500);
  };

  const stats = [
    { label: 'Məhsullarım', value: products.length, icon: <Package size={22} />, color: '#D4AF37' },
    { label: 'Ümumi Baxış', value: '1,248', icon: <Eye size={22} />, color: '#2A9D8F' },
    { label: 'Sifarişlər', value: '24', icon: <ShoppingBag size={22} />, color: '#E63946' },
    { label: 'Trend', value: '+12%', icon: <TrendingUp size={22} />, color: '#4361ee' },
  ];

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>BAME<span>.</span></div>

        <div className={styles.storeInfo}>
          <div className={styles.storeAvatar}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className={styles.storeName}>{user.storeName}</p>
            <p className={styles.storeEmail}>{user.email}</p>
          </div>
        </div>

        <nav className={styles.sideNav}>
          {TABS.map(tab => (
            <button
              key={tab}
              className={`${styles.navItem} ${activeTab === tab ? styles.navActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Məhsullarım' ? <Package size={18} /> : <PlusCircle size={18} />}
              {tab}
            </button>
          ))}
          <button className={styles.navItem} onClick={() => navigate('/shop')}>
            <Store size={18} /> Mağazaya Bax
          </button>
        </nav>

        <button className={styles.logoutBtn} onClick={() => { logout(); navigate('/'); }}>
          <LogOut size={18} /> Çıxış
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.mainHeader}>
          <div>
            <h1>Xoş gəldiniz, {user.name}! 👋</h1>
            <p>Mağazanızı idarə edin və məhsullarınızı əlavə edin.</p>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {stats.map(stat => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
              <div>
                <p className={styles.statValue}>{stat.value}</p>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          <AnimatePresence mode="wait">
            {activeTab === 'Məhsullarım' ? (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className={styles.sectionHeader}>
                  <h2>Bütün Məhsullar ({products.length})</h2>
                  <button className={styles.addBtn} onClick={() => setActiveTab('Məhsul Əlavə Et')}>
                    <PlusCircle size={16} /> Yeni Məhsul
                  </button>
                </div>
                <div className={styles.table}>
                  <div className={styles.tableHeader}>
                    <span>Məhsul</span>
                    <span>Kateqoriya</span>
                    <span>Qiymət</span>
                    <span>Reytinq</span>
                    <span>Əməliyyat</span>
                  </div>
                  {products.map(p => (
                    <div key={p.id} className={styles.tableRow}>
                      <div className={styles.productCell}>
                        <img src={p.img} alt={p.name} onError={e => { e.target.src = 'https://placehold.co/48x48/f5f0e8/D4AF37?text=B'; }} />
                        <span>{p.name}</span>
                      </div>
                      <span className={styles.catTag}>{categories.find(c => c.id === p.category)?.label}</span>
                      <span className={styles.priceCell}>{p.price} AZN</span>
                      <span>⭐ {p.rating}</span>
                      <button className={styles.deleteBtn} onClick={() => deleteProduct(p.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="add"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={styles.addForm}
              >
                <h2>Yeni Məhsul Əlavə Et</h2>
                <p>Əlavə etdiyiniz məhsul dərhal mağazada görünəcək.</p>

                {success && (
                  <div className={styles.successMsg}>
                    ✅ Məhsul uğurla əlavə edildi!
                  </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Məhsul Adı *</label>
                      <input name="name" value={form.name} onChange={handleChange}
                        placeholder="məs. Qızılı Boyunbağı" required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Kateqoriya *</label>
                      <select name="category" value={form.category} onChange={handleChange}>
                        {categories.filter(c => c.id !== 'all').map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Qiymət (AZN) *</label>
                      <input name="price" type="number" value={form.price}
                        onChange={handleChange} placeholder="məs. 45" required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Köhnə Qiymət (AZN)</label>
                      <input name="oldPrice" type="number" value={form.oldPrice}
                        onChange={handleChange} placeholder="məs. 60 (isteğe bağlı)" />
                    </div>
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: '1/-1' }}>
                    <label>Şəkil URL-i *</label>
                    <input name="img" value={form.img} onChange={handleChange}
                      placeholder="https://images.unsplash.com/..." required />
                    {form.img && (
                      <div className={styles.imgPreview}>
                        <img src={form.img} alt="preview"
                          onError={e => e.target.style.display = 'none'} />
                      </div>
                    )}
                  </div>

                  <button type="submit" className={styles.submitBtn}>
                    <PlusCircle size={18} /> Məhsulu Əlavə Et
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
