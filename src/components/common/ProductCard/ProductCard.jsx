import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product.id);
  const [added, setAdded] = useState(false);

  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const handleAddToCart = (e) => {
    e?.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      className={styles.card}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
    >
      {/* ─── Image Section ─── */}
      <div className={styles.imageWrapper}>
        <Link to={`/product/${product.id}`} tabIndex={-1}>
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            onError={e => {
              e.target.style.display = 'none';
              e.target.parentNode.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e8e0d5 100%)';
            }}
          />
        </Link>

        {/* Top Badge */}
        {product.badge && (
          <span className={styles.topBadge}>
            {product.badge === 'Bestseller' ? '🏆 Ən çox satılan' : product.badge === 'Yeni' ? '✨ Yeni' : product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          className={`${styles.wishlistBtn} ${isLiked ? styles.wishlisted : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          aria-label={isLiked ? 'Bəyəndiklərdən çıxart' : 'Bəyəndiklərə əlavə et'}
        >
          <Heart size={15} fill={isLiked ? 'currentColor' : 'none'} />
        </button>

        {/* Desktop Hover Quick-Add */}
        <div className={styles.quickAdd}>
          <button
            className={`${styles.quickAddBtn} ${added ? styles.added : ''}`}
            onClick={handleAddToCart}
          >
            {added ? <Check size={15} /> : <ShoppingCart size={15} />}
            {added ? 'Əlavə edildi!' : 'Səbətə At'}
          </button>
        </div>
      </div>

      {/* ─── Info Section ─── */}
      <div className={styles.cardBody}>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>

        <div className={styles.ratingRow}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
                color={i < Math.floor(product.rating) ? '#f59e0b' : '#d1d5db'}
              />
            ))}
          </div>
          <span className={styles.reviewCount}>({product.reviews})</span>
        </div>

        <div className={styles.priceContainer}>
          <div className={styles.priceRow}>
            {discountPercent && (
              <span className={styles.discountBadge}>-{discountPercent}%</span>
            )}
            <span className={styles.price}>{product.price} ₼</span>
            {product.oldPrice && (
              <span className={styles.oldPrice}>{product.oldPrice} ₼</span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Add Button (always visible on mobile) */}
      <button
        className={`${styles.mobileAddBtn} ${added ? styles.mobileAdded : ''}`}
        onClick={handleAddToCart}
        aria-label="Səbətə əlavə et"
      >
        {added ? <Check size={15} /> : <ShoppingCart size={15} />}
        {added ? 'Əlavə edildi!' : 'Səbətə At'}
      </button>
    </motion.div>
  );
};

export default ProductCard;
