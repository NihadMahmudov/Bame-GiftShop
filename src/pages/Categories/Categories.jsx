import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Zap, 
  Tag, 
  TrendingUp, 
  Ticket, 
  ArrowDownCircle, 
  LayoutGrid 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories, products } from '../../data/products';
import styles from './Categories.module.css';

const SIDEBAR_TABS = [
  { id: 'kateqoriyalar', label: 'Kateqoriyalar', icon: <LayoutGrid size={18} /> },
  { id: 'flash', label: 'Flaş Məhsullar', icon: <Zap size={18} /> },
  { id: 'endirimli', label: 'Endirimli Məhsullar', icon: <Tag size={18} /> },
  { id: 'satilanlar', label: 'Çox Satılanlar', icon: <TrendingUp size={18} /> },
  { id: 'kuponlu', label: 'Kuponlu Məhsullar', icon: <Ticket size={18} /> },
  { id: 'ucuzlasanlar', label: 'Qiyməti düşənlər', icon: <ArrowDownCircle size={18} /> }
];

const Categories = ({ inPanel = false }) => {
  const [activeTab, setActiveTab] = useState('kateqoriyalar');
  const navigate = useNavigate();

  // Curated category images for a professional look
  const categoryDefaults = {
    decor: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&q=80&auto=format&fit=crop',
    jewelry: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80&auto=format&fit=crop',
    candles: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=200&q=80&auto=format&fit=crop',
    accessories: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&q=80&auto=format&fit=crop',
    sets: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=200&q=80&auto=format&fit=crop'
  };

  const getCategoryImage = (catId) => {
    // Priority: Curated list -> First product image -> Placeholder
    if (categoryDefaults[catId]) return categoryDefaults[catId];
    const product = products.find(p => p.category === catId);
    return product ? product.img : 'https://placehold.co/100x100/f5f0e8/D4AF37?text=' + catId;
  };

  const handleCategoryClick = (catId) => {
    navigate(`/shop?category=${catId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <div className={`${styles.pageContainer} ${inPanel ? styles.inPanel : ''}`}>
      {/* Search Header */}
      {!inPanel && (
        <div className={styles.searchHeader}>
          <div className={styles.searchBox}>
            <Search size={20} className={styles.searchIcon} />
            <input type="text" placeholder="Brend, məhsul və ya kateqoriya axtar" />
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className={styles.mainLayout}>
        {/* Left Sidebar */}
        <div className={styles.sidebar}>
          {SIDEBAR_TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.sidebarItem} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className={styles.content}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className={styles.tabContent}
            >
              {activeTab === 'kateqoriyalar' ? (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className={styles.categoryGrid}
                >
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <motion.div 
                      key={cat.id} 
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={styles.catCard} 
                      onClick={() => handleCategoryClick(cat.id)}
                    >
                      <div className={styles.catImageWrapper}>
                        <img src={getCategoryImage(cat.id)} alt={cat.label} />
                        <div className={styles.cubeBadge}>📦</div>
                      </div>
                      <span className={styles.catName}>{cat.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className={styles.specialProductsGrid}
                >
                  <div className={styles.tabHeader}>
                    <h2>{SIDEBAR_TABS.find(t => t.id === activeTab)?.label}</h2>
                    <p>Sizin üçün seçilmiş ən yaxşı təkliflər</p>
                  </div>
                  <div className={styles.grid}>
                    {products.filter(p => {
                      if (!p.collections) return false;
                      if (activeTab === 'flash') return p.collections.includes('flash');
                      if (activeTab === 'endirimli') return p.collections.includes('discount');
                      if (activeTab === 'satilanlar') return p.collections.includes('bestseller');
                      if (activeTab === 'kuponlu') return p.collections.includes('coupon');
                      if (activeTab === 'ucuzlasanlar') return p.collections.includes('discount');
                      return false;
                    }).map(product => (
                      <motion.div 
                        key={product.id} 
                        variants={itemVariants}
                        className={styles.productMiniCard}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <div className={styles.miniImgWrapper}>
                          <img src={product.img} alt={product.name} />
                          {product.badge && <span className={styles.miniBadge}>{product.badge}</span>}
                        </div>
                        <div className={styles.miniInfo}>
                          <h4>{product.name}</h4>
                          <div className={styles.miniPrice}>
                            <span className={styles.currentPrice}>{product.price} AZN</span>
                            {product.oldPrice && <span className={styles.oldPrice}>{product.oldPrice} AZN</span>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Categories;
