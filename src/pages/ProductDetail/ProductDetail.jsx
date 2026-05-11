import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleOrderNow = () => {
    addToCart({ ...product, quantity });
    navigate('/cart');
  };

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className={styles.loading}>
        <p>Məhsul yüklənir və ya tapılmadı...</p>
        <button onClick={() => navigate('/shop')}>Mağazaya Qayıt</button>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);

  return (
    <div className={`container ${styles.page}`}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Geri Qayıt
      </button>

      <div className={styles.productGrid}>
        {/* Sol tərəf - Şəkil */}
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img src={product.img} alt={product.name} />
            {product.badge && <span className={styles.badge}>{product.badge}</span>}
          </div>
        </div>

        {/* Sağ tərəf - Məlumarlar */}
        <div className={styles.infoSection}>
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.title}>{product.name}</h1>

          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < 5 ? "var(--primary)" : "none"} color="var(--primary)" />
              ))}
            </div>
            <span className={styles.reviews}>(24 Rəy)</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.price}>{product.price} AZN</span>
            {product.oldPrice && <span className={styles.oldPrice}>{product.oldPrice} AZN</span>}
          </div>

          <p className={styles.description}>
            {product.description || "Bu məhsul Bame Gift Shop tərəfindən xüsusi olaraq seçilmişdir. Yüksək keyfiyyət və estetik dizaynı ilə seçilir. Həm özünüz, həm də sevdikləriniz üçün mükəmməl hədiyyə seçimidir."}
          </p>

          <div className={styles.actions}>
            <div className={styles.quantity}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button
              className={`${styles.addToCart} ${added ? styles.added : ''}`}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={20} />
              {added ? 'Əlavə edildi!' : 'Səbətə At'}
            </button>
            <button className={styles.orderNow} onClick={handleOrderNow}>
              Sifariş Et
            </button>
            <button className={`${styles.wishlist} ${isLiked ? styles.active : ''}`} onClick={() => toggleWishlist(product)}>
              <Heart size={24} fill={isLiked ? "var(--error)" : "none"} color={isLiked ? "var(--error)" : "currentColor"} />
            </button>
          </div>

          <div className={styles.features}>
            <div className={styles.featureItem}>
              <Truck size={20} />
              <span>Sürətli Çatdırılma (24 saat ərzində)</span>
            </div>
            <div className={styles.featureItem}>
              <ShieldCheck size={20} />
              <span>100% Keyfiyyət Zəmanəti</span>
            </div>
            <div className={styles.featureItem}>
              <RotateCcw size={20} />
              <span>Rahat Qaytarılma</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
