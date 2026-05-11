import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import styles from './Wishlist.module.css';

const Wishlist = ({ inPanel = false }) => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className={styles.emptyWishlist}>
        <h2>İstək siyahınız boşdur</h2>
        <p>Bəyəndiyiniz məhsulları bura əlavə edərək daha sonra baxa bilərsiniz.</p>
      </div>
    );
  }

  return (
    <div className={`${inPanel ? '' : 'container'} ${styles.wishlistContainer} ${inPanel ? styles.inPanel : ''}`}>
      <h1 className={styles.title}>Bəyəndiklərim</h1>

      <div className={styles.grid}>
        {wishlist.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
