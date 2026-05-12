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

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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
        <Link to={`/product/${product.id}`}>
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
        {product.badge && (
          <span className={styles.badge}>
            {product.badge === 'Bestseller' ? 'Ən çox satılan məhsul' : product.badge === 'Yeni' ? 'Yeni gələn məhsul' : product.badge}
          </span>
        )}
        <button
          className={`${styles.wishlistBtn} ${isLiked ? styles.wishlisted : ''}`}
          onClick={() => toggleWishlist(product)}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} color={isLiked ? 'currentColor' : '#6b7280'} />
        </button>
        <div className={styles.quickAdd}>
          <button 
            className={`${styles.quickAddBtn} ${added ? styles.added : ''}`} 
            onClick={handleAddToCart}
            style={added ? { backgroundColor: '#10b981', color: 'white' } : {}}
          >
            {added ? <Check size={16} /> : <ShoppingCart size={16} />} 
            {added ? ' Əlavə edildi' : ' Səbətə At'}
          </button>
        </div>
      </div>

      <div className={styles.cardBody}>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        <div className={styles.ratingRow}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
                color={i < Math.floor(product.rating) ? '#f59e0b' : '#d1d5db'}
              />
            ))}
          </div>
          <span className={styles.reviewCount}>({product.reviews})</span>
        </div>

        <div className={styles.discountTag}>
          <span className={styles.tagIcon}>🏷️</span>
          <span>əlavə endirim</span>
        </div>

        <div className={styles.priceContainer}>
          <div className={styles.priceRow}>
            {product.oldPrice && (
              <span className={styles.discountBadge}>
                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
              </span>
            )}
            <span className={styles.price}>{product.price} ₼</span>
            {product.oldPrice && (
              <span className={styles.oldPrice}>{product.oldPrice} ₼</span>
            )}
          </div>
          <p className={styles.unitPrice}>({(product.price * 0.8).toFixed(2)} ₼ / Servis)</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
