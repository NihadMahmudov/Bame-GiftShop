import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, PlusCircle, Trash2,
  LogOut, Store, TrendingUp, ShoppingBag, Eye, ImagePlus,
  ShoppingCart, Zap, Calendar, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import styles from './Dashboard.module.css';

const TABS = ['Məhsullarım', 'Məhsul Əlavə Et', 'Kateqoriyalar', 'Sifarişlər', 'Analitika', 'Flaş Satış'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { 
    products, addProduct, deleteProduct, 
    categories, addCategory, deleteCategory, updateCategoryImage,
    badges, addBadge, deleteBadge,
    collections, addCollection, deleteCollection
  } = useProducts();
  const { orders, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState('Məhsullarım');
  const [form, setForm] = useState({
    name: '', price: '', oldPrice: '', category: 'decor',
    img: '', description: '', badge: '', collections: []
  });
  const [newCat, setNewCat] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newColl, setNewColl] = useState('');
  const [success, setSuccess] = useState(false);

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

  const totalViews = products.reduce((acc, p) => acc + (p.reviews || 0), 0) * 12;
  const trend = products.length > 0 ? `+${Math.round((orders.length / products.length) * 100)}%` : '0%';

  const stats = [
    { label: 'Məhsullarım', value: products.length, icon: <Package size={22} />, color: '#D4AF37' },
    { label: 'Ümumi Baxış', value: totalViews.toLocaleString(), icon: <Eye size={22} />, color: '#2A9D8F' },
    { label: 'Sifarişlər', value: orders.length, icon: <ShoppingBag size={22} />, color: '#E63946' },
    { label: 'Trend', value: trend, icon: <TrendingUp size={22} />, color: '#4361ee' },
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
              {tab === 'Məhsullarım' ? <Package size={18} /> : 
               tab === 'Sifarişlər' ? <ShoppingBag size={18} /> : 
               tab === 'Kateqoriyalar' ? <LayoutDashboard size={18} /> :
               tab === 'Analitika' ? <TrendingUp size={18} /> : 
               tab === 'Flaş Satış' ? <Zap size={18} /> : 
               <PlusCircle size={18} />}
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
                        {badges.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
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
                      {collections.map(opt => (
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
            ) : activeTab === 'Kateqoriyalar' ? (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className={styles.sectionHeader}>
                  <h2>Kateqoriya və Etiket İdarəedilməsi</h2>
                  <p>Yeni kateqoriya və ya etiket (badge) əlavə edin.</p>
                </div>

                <div className={styles.managementGrid}>
                  {/* Category Management */}
                  <div className={styles.manageBox}>
                    <h3>Kateqoriya Əlavə Et</h3>
                    <div className={styles.manageAction}>
                      <input 
                        value={newCat} 
                        onChange={e => setNewCat(e.target.value)} 
                        placeholder="məs. Texnologiya" 
                      />
                      <button onClick={() => { if(newCat){ addCategory(newCat); setNewCat(''); } }}>
                        <PlusCircle size={18} /> Əlavə Et
                      </button>
                    </div>
                  </div>

                  {/* Badge Management */}
                  <div className={styles.manageBox}>
                    <h3>Yeni Etiket Əlavə Et</h3>
                    <div className={styles.manageAction}>
                      <input 
                        value={newBadge} 
                        onChange={e => setNewBadge(e.target.value)} 
                        placeholder="məs. Məhdud Sayda" 
                      />
                      <button onClick={() => { if(newBadge){ addBadge(newBadge); setNewBadge(''); } }}>
                        <PlusCircle size={18} /> Əlavə Et
                      </button>
                    </div>
                  </div>

                  {/* Collection Management */}
                  <div className={styles.manageBox}>
                    <h3>Xüsusi Kolleksiya Əlavə Et</h3>
                    <div className={styles.manageAction}>
                      <input 
                        value={newColl} 
                        onChange={e => setNewColl(e.target.value)} 
                        placeholder="məs. Bayram Hədiyyələri" 
                      />
                      <button onClick={() => { if(newColl){ addCollection(newColl); setNewColl(''); } }}>
                        <PlusCircle size={18} /> Əlavə Et
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.badgeListSection}>
                  <div className={styles.manageRow}>
                    <div className={styles.manageHalf}>
                      <h3>Mövcud Etiketlər</h3>
                      <div className={styles.badgeTags}>
                        {badges.map(b => (
                          <span key={b} className={styles.badgeTag}>
                            {b} <button onClick={() => deleteBadge(b)}>×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.manageHalf}>
                      <h3>Mövcud Kolleksiyalar</h3>
                      <div className={styles.badgeTags}>
                        {collections.map(c => (
                          <span key={c.id} className={styles.badgeTag}>
                            {c.label} <button onClick={() => deleteCollection(c.id)}>×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.sectionHeader} style={{ marginTop: '40px' }}>
                  <h2>Kateqoriya Şəkilləri</h2>
                </div>
                <div className={styles.categoryEditorGrid}>
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <div key={cat.id} className={styles.categoryEditCard}>
                      <div className={styles.catEditImg}>
                        <img src={cat.img} alt={cat.label} onError={e => { e.target.src = 'https://placehold.co/200x150/f5f0e8/D4AF37?text=' + cat.label; }} />
                        <label className={styles.uploadOverlay}>
                          <ImagePlus size={24} />
                          <input 
                            type="file" 
                            accept="image/*" 
                            hidden 
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => updateCategoryImage(cat.id, reader.result);
                                reader.readAsDataURL(file);
                              }
                            }} 
                          />
                        </label>
                      </div>
                      <div className={styles.catEditInfo}>
                        <h3>{cat.label}</h3>
                        <div className={styles.catCardFooter}>
                          <span>{products.filter(p => p.category === cat.id).length} Məhsul</span>
                          <button className={styles.catDeleteBtn} onClick={() => deleteCategory(cat.id)}>
                            <Trash2 size={14} /> Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : activeTab === 'Analitika' ? (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className={styles.sectionHeader}>
                  <h2>Mağaza Analitikası</h2>
                  <p>Məhsul və kateqoriya üzrə satış performansınız.</p>
                </div>

                <div className={styles.analyticsGrid}>
                  {/* Category Performance */}
                  <div className={styles.chartBox}>
                    <h3>Kateqoriya üzrə Məhsul Sayı</h3>
                    <div className={styles.barChart}>
                      {categories.filter(c => c.id !== 'all').map(cat => {
                        const count = products.filter(p => p.category === cat.id).length;
                        const percentage = products.length > 0 ? (count / products.length) * 100 : 0;
                        return (
                          <div key={cat.id} className={styles.barItem}>
                            <div className={styles.barLabel}>
                              <span>{cat.label}</span>
                              <span>{count} ədəd</span>
                            </div>
                            <div className={styles.barTrack}>
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                className={styles.barFill} 
                                style={{ background: 'var(--primary)' }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className={styles.chartBox}>
                    <h3>Ən Çox Maraq Görən Məhsullar (Rəylər)</h3>
                    <div className={styles.topProductsList}>
                      {[...products].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 5).map(p => {
                        const maxReviews = Math.max(...products.map(pr => pr.reviews || 0), 1);
                        const percentage = ((p.reviews || 0) / maxReviews) * 100;
                        return (
                          <div key={p.id} className={styles.topProdItem}>
                            <img src={p.img} alt={p.name} />
                            <div className={styles.topProdInfo}>
                              <div className={styles.topProdHeader}>
                                <h4>{p.name}</h4>
                                <span>{p.reviews || 0} rəy</span>
                              </div>
                              <div className={styles.miniBarTrack}>
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  className={styles.miniBarFill} 
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Status Summary */}
                <div className={styles.statusGrid}>
                  <div className={styles.statusBox}>
                    <div className={styles.statusIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                      <ShoppingCart size={24} />
                    </div>
                    <div>
                      <h4>Təsdiqlənmiş Sifarişlər</h4>
                      <p>{orders.filter(o => o.status === 'approved' || o.status === 'delivered').length}</p>
                    </div>
                  </div>
                  <div className={styles.statusBox}>
                    <div className={styles.statusIcon} style={{ background: '#fff3e0', color: '#ef6c00' }}>
                      <Package size={24} />
                    </div>
                    <div>
                      <h4>Gözləmədə Olanlar</h4>
                      <p>{orders.filter(o => o.status === 'pending').length}</p>
                    </div>
                  </div>
                </div>
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
            ) }
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
