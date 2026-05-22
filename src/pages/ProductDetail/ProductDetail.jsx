import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import RecentlyViewed from '../../components/home/RecentlyViewed';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, addComment } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [commentForm, setCommentForm] = useState({ name: '', rating: 5, text: '' });
  const [showCommentSuccess, setShowCommentSuccess] = useState(false);

  const categoryLabel = categories.find(c => c.id === product?.category)?.label || product?.category;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleOrderNow = () => {
    addToCart({ ...product, quantity });
    navigate('/cart');
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.text) return;
    addComment(product.id, commentForm);
    setCommentForm({ name: '', rating: 5, text: '' });
    setShowCommentSuccess(true);
    setTimeout(() => setShowCommentSuccess(false), 3000);
  };

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      
      const saved = localStorage.getItem('bame_recent');
      let ids = saved ? JSON.parse(saved) : [];
      ids = [foundProduct.id, ...ids.filter(i => i !== foundProduct.id)].slice(0, 10);
      localStorage.setItem('bame_recent', JSON.stringify(ids));
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

  if (!user) {
    return (
      <div className={`container ${styles.authRequired}`}>
        <div className={styles.authCard}>
          <div className={styles.authIcon}>🔒</div>
          <h2>Məhsula baxmaq üçün giriş edin</h2>
          <p>Flash satış və digər bütün özəl təklifləri görmək üçün hesabınıza daxil olun və ya yeni hesab yaradın.</p>
          <div className={styles.authActions}>
            <button onClick={() => navigate('/login')} className={styles.loginBtn}>Daxil Ol</button>
            <button onClick={() => navigate('/login')} className={styles.registerBtn}>Qeydiyyatdan Keç</button>
          </div>
          <button onClick={() => navigate('/')} className={styles.backHome}>Ana Səhifəyə Qayıt</button>
        </div>
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
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img src={product.img} alt={product.name} />
            {product.badge && <span className={styles.badge}>{product.badge}</span>}
          </div>
        </div>

        <div className={styles.infoSection}>
          <p className={styles.category}>{categoryLabel}</p>
          <h1 className={styles.title}>{product.name}</h1>

          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.round(product.rating || 5) ? "var(--primary)" : "none"} color="var(--primary)" />
              ))}
            </div>
            <span className={styles.reviews}>({product.reviews || 0} Rəy)</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.price}>{product.price} AZN</span>
            {product.oldPrice && <span className={styles.oldPrice}>{product.oldPrice} AZN</span>}
          </div>

          <p className={styles.description}>
            {product.description || "Bu məhsul Bame Gift Shop tərəfindən xüsusi olaraq seçilmişdir."}
          </p>

          <div className={styles.actions}>
            <div className={styles.topActions}>
              <div className={styles.quantity}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button className={`${styles.addToCart} ${added ? styles.added : ''}`} onClick={handleAddToCart}>
                <ShoppingCart size={20} /> {added ? 'Əlavə edildi!' : 'Səbətə At'}
              </button>
              <button className={`${styles.wishlist} ${isLiked ? styles.active : ''}`} onClick={() => toggleWishlist(product)}>
                <Heart size={24} fill={isLiked ? "var(--error)" : "none"} color={isLiked ? "var(--error)" : "currentColor"} />
              </button>
            </div>
            <button className={styles.orderNow} onClick={handleOrderNow}>Sifariş Et</button>
          </div>

          <div className={styles.features}>
            <div className={styles.featureItem}><Truck size={20} /> <span>Sürətli Çatdırılma</span></div>
            <div className={styles.featureItem}><ShieldCheck size={20} /> <span>100% Keyfiyyət Zəmanəti</span></div>
            <div className={styles.featureItem}><RotateCcw size={20} /> <span>Rahat Qaytarılma</span></div>
          </div>
        </div>
      </div>

      <div className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <h2>Müştəri Rəyləri</h2>
          <div className={styles.ratingOverview}>
            <div className={styles.bigRating}>{product.rating || 5.0}</div>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill={i < 5 ? "var(--primary)" : "none"} color="var(--primary)" />
              ))}
            </div>
            <span>{product.reviews || 0} rəy</span>
          </div>
        </div>

        <div className={styles.reviewsGrid}>
          <div className={styles.commentFormBox}>
            <h3>Rəy Bildir</h3>
            {showCommentSuccess && <div className={styles.successNote}>Təşəkkür edirik! Rəyiniz əlavə edildi.</div>}
            <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
              <input type="text" required value={commentForm.name} onChange={e => setCommentForm({...commentForm, name: e.target.value})} placeholder="Adınız" />
              <div className={styles.starSelector}>
                {[1, 2, 3, 4, 5].map(num => (
                  <button key={num} type="button" onClick={() => setCommentForm({...commentForm, rating: num})}>
                    <Star size={24} fill={commentForm.rating >= num ? "var(--primary)" : "none"} />
                  </button>
                ))}
              </div>
              <textarea required rows="4" value={commentForm.text} onChange={e => setCommentForm({...commentForm, text: e.target.value})} placeholder="Rəyiniz..."></textarea>
              <button type="submit" className={styles.submitComment}>Rəyi Göndər</button>
            </form>
          </div>

          <div className={styles.commentsList}>
            {product.comments?.map(comment => (
              <div key={comment.id} className={styles.commentItem}>
                <div className={styles.commentMeta}>
                  <div className={styles.userAvatar}>{comment.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <h4 className={styles.userName}>{comment.name}</h4>
                    <div className={styles.itemStars}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < comment.rating ? "var(--primary)" : "none"} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className={styles.commentText}>{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RecentlyViewed />
    </div>
  );
};

export default ProductDetail;
