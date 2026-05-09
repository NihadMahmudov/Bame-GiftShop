import React, { useState, useMemo } from 'react';
import { Heart, Star, ShoppingCart, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../../data/products';
import { useProducts } from '../../context/ProductContext';
import styles from './Shop.module.css';

const sortOptions = [
  { value: 'default', label: 'Standart' },
  { value: 'price-asc', label: 'Qiymət: Aşağıdan Yuxarı' },
  { value: 'price-desc', label: 'Qiymət: Yuxarıdan Aşağı' },
  { value: 'rating', label: 'Ən Çox Bəyənilən' },
  { value: 'newest', label: 'Ən Yeni' },
];

const ProductCard = ({ product }) => {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <motion.div
      className={styles.card}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.imageWrapper}>
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          onError={e => {
            e.target.style.display = 'none';
            e.target.parentNode.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e8e0d5 100%)';
          }}
        />
        {product.badge && (
          <span className={`${styles.badge} ${styles[`badge_${product.badge === 'Endirim' ? 'sale' : product.badge === 'Yeni' ? 'new' : 'best'}`]}`}>
            {product.badge}
          </span>
        )}
        <button
          className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
          onClick={() => setWishlisted(!wishlisted)}
        >
          <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        <div className={styles.quickAdd}>
          <button className={styles.quickAddBtn}>
            <ShoppingCart size={16} /> Səbətə At
          </button>
        </div>
      </div>

      <div className={styles.cardBody}>
        <p className={styles.category}>{categories.find(c => c.id === product.category)?.label}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.ratingRow}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                fill={i < Math.floor(product.rating) ? 'var(--primary)' : 'none'}
                color={i < Math.floor(product.rating) ? 'var(--primary)' : '#ccc'}
              />
            ))}
          </div>
          <span className={styles.reviewCount}>({product.reviews})</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.price}>{product.price} AZN</span>
          {product.oldPrice && (
            <span className={styles.oldPrice}>{product.oldPrice} AZN</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Shop = () => {
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let result = activeCategory === 'all'
      ? [...products]
      : products.filter(p => p.category === activeCategory);

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => (b.badge === 'Yeni') - (a.badge === 'Yeni')); break;
      default: break;
    }
    return result;
  }, [activeCategory, sortBy]);

  return (
    <div className={styles.shopPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <p className={styles.breadcrumb}>Ana Səhifə / <span>Kolleksiyalar</span></p>
          <h1>Bizim Kolleksiyalarımız</h1>
          <p className={styles.subtitle}>Hər məqsəd üçün mükəmməl hədiyyəni kəşf edin</p>
        </div>
      </div>

      <div className={`container ${styles.shopContainer}`}>
        {/* Filter + Sort Bar */}
        <div className={styles.toolBar}>
          <div className={styles.categoryFilters}>
            <SlidersHorizontal size={18} className={styles.filterIcon} />
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`${styles.catBtn} ${activeCategory === cat.id ? styles.catActive : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className={styles.sortWrapper}>
            <button
              className={styles.sortBtn}
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              {sortOptions.find(s => s.value === sortBy)?.label}
              <ChevronDown size={16} className={showSortDropdown ? styles.rotated : ''} />
            </button>
            {showSortDropdown && (
              <div className={styles.sortDropdown}>
                {sortOptions.map(opt => (
                  <button
                    key={opt.value}
                    className={`${styles.sortOption} ${sortBy === opt.value ? styles.sortActive : ''}`}
                    onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <p className={styles.resultCount}>
          <strong>{filteredAndSorted.length}</strong> məhsul tapıldı
        </p>

        {/* Product Grid */}
        <motion.div layout className={styles.grid}>
          <AnimatePresence>
            {filteredAndSorted.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Shop;
