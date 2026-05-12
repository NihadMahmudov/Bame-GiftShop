import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, PlusCircle, Trash2,
  LogOut, Store, TrendingUp, ShoppingBag, Eye, ImagePlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { categories } from '../../data/products';
import styles from './Dashboard.module.css';

const TABS = ['Məhsullarım', 'Məhsul Əlavə Et', 'Sifarişlər'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { products, addProduct, deleteProduct } = useProducts();
  const { orders, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState('Məhsullarım');
  const [form, setForm] = useState({
    name: '', price: '', oldPrice: '', category: 'decor',
    img: '', description: '', badge: '', collections: []
  });
  const [success, setSuccess] = useState(false);

  const COLLECTION_OPTIONS = [
    { id: 'flash', label: 'Flaş Məhsullar' },
    { id: 'bestseller', label: 'Çox Satılanlar' },
    { id: 'discount', label: 'Endirimli Məhsullar' },
    { id: 'coupon', label: 'Kuponlu Məhsullar' }
  ];

  // Redirect if not logged in or not admin
  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCollectionChange = (id) => {
    setForm(prev => ({
      ...prev,
      collections: prev.collections.includes(id)
        ? prev.collections.filter(c => c !== id)
        : [...prev.collections, id]
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, img: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.price || !form.img) return;
    addProduct({
      name: form.name,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      category: form.category,
      img: form.img,
      description: form.description,
      badge: form.badge,
      collections: form.collections
    });
    setForm({ name: '', price: '', oldPrice: '', category: 'decor', img: '', description: '', badge: '', collections: [] });
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setActiveTab('Məhsullarım'); }, 1500);
  };

  const stats = [
    { label: 'Məhsullarım', value: products.length, icon: <Package size={22} />, color: '#D4AF37' },
    { label: 'Ümumi Baxış', value: '1,248', icon: <Eye size={22} />, color: '#2A9D8F' },
    { label: 'Sifarişlər', value: orders.length, icon: <ShoppingBag size={22} />, color: '#E63946' },
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
              {tab === 'Məhsullarım' ? <Package size={18} /> : tab === 'Sifarişlər' ? <ShoppingBag size={18} /> : <PlusCircle size={18} />}
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
            ) : activeTab === 'Məhsul Əlavə Et' ? (
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

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Etiket (Badge)</label>
                      <select name="badge" value={form.badge} onChange={handleChange}>
                        <option value="">Heç biri</option>
                        <option value="Yeni">Yeni</option>
                        <option value="Bestseller">Ən çox satılan</option>
                        <option value="Endirim">Endirim</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Məhsulun Təsviri</label>
                      <input name="description" value={form.description} onChange={handleChange} placeholder="Məhsul haqqında qısa məlumat" />
                    </div>
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: '1/-1' }}>
                    <label>Xüsusi Kolleksiyalar (Həmin bölmələrə düşməsi üçün seçin)</label>
                    <div className={styles.collectionsGrid}>
                      {COLLECTION_OPTIONS.map(opt => (
                        <label key={opt.id} className={styles.checkboxLabel}>
                          <input 
                            type="checkbox" 
                            checked={form.collections.includes(opt.id)}
                            onChange={() => handleCollectionChange(opt.id)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: '1/-1' }}>
                    <label>Məhsul Şəkli *</label>
                    <div className={styles.imageUploadBox}>
                      <input type="file" accept="image/*" onChange={handleImageUpload} required={!form.img} />
                      {form.img ? (
                        <img src={form.img} alt="preview" className={styles.imgPreviewFull} />
                      ) : (
                        <>
                          <ImagePlus size={40} className={styles.uploadIcon} />
                          <div className={styles.uploadText}>Şəkil yükləmək üçün bura tıklayın və ya sürükləyin</div>
                          <div className={styles.uploadSub}>PNG, JPG, WEBP (maks. 5MB)</div>
                        </>
                      )}
                    </div>
                  </div>

                  <button type="submit" className={styles.submitBtn}>
                    <PlusCircle size={18} /> Məhsulu Əlavə Et
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className={styles.sectionHeader}>
                  <h2>Bütün Sifarişlər ({orders.length})</h2>
                </div>
                <div className={styles.table}>
                  <div className={styles.tableHeader}>
                    <span>ID</span>
                    <span>Müştəri</span>
                    <span>Məbləğ</span>
                    <span>Status</span>
                    <span>Əməliyyat</span>
                  </div>
                  {orders.map(o => (
                    <div key={o.id} className={styles.tableRow}>
                      <span>#{o.id.slice(-4)}</span>
                      <span>{o.customerName}</span>
                      <span className={styles.priceCell}>{o.total} AZN</span>
                      <span className={styles.statusBadge}>{o.status}</span>
                      <select 
                        value={o.status} 
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className={styles.statusSelect}
                      >
                        <option value="pending">Gözləmədə</option>
                        <option value="approved">Təsdiqləndi</option>
                        <option value="shipped">Yoldadır</option>
                        <option value="delivered">Çatdırıldı</option>
                      </select>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
