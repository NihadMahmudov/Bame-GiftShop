import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../../data/products';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import styles from './Shop.module.css';

const sortOptions = [
  { value: 'default', label: 'Standart' },
  { value: 'price-asc', label: 'Qiymət: Aşağıdan Yuxarı' },
  { value: 'price-desc', label: 'Qiymət: Yuxarıdan Aşağı' },
  { value: 'rating', label: 'Ən Çox Bəyənilən' },
  { value: 'newest', label: 'Ən Yeni' },
];

import ProductCard from '../../components/common/ProductCard/ProductCard';

const Shop = ({ inPanel = false }) => {
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
    <div className={`${styles.shopPage} ${inPanel ? styles.inPanel : ''}`}>
      {/* Page Header - Only show if not in user panel */}
      {!inPanel && (
        <div className={styles.pageHeader}>
          <div className="container">
            <p className={styles.breadcrumb}>Ana Səhifə / <span>Kolleksiyalar</span></p>
            <h1>Bizim Kolleksiyalarımız</h1>
            <p className={styles.subtitle}>Hər məqsəd üçün mükəmməl hədiyyəni kəşf edin</p>
          </div>
        </div>
      )}

      <div className={`${inPanel ? '' : 'container'} ${styles.shopContainer}`}>
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
