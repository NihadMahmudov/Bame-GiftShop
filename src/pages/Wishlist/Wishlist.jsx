import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/social/ProductFeed/ProductCard';
import styles from './Wishlist.module.css';

const Wishlist = () => {
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
    <div className={`container ${styles.wishlistContainer}`}>
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
