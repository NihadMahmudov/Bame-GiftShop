import React from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Minus, Plus } from 'lucide-react';
import styles from './Cart.module.css';

const Cart = ({ inPanel = false }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  const handleCheckout = () => {
    alert("Sifarişiniz uğurla qəbul edildi! Bame sizi sevir!");
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>Səbətiniz boşdur</h2>
        <p>Görünür hələ heç bir məhsul əlavə etməmisiniz.</p>
      </div>
    );
  }

  return (
    <div className={`${inPanel ? '' : 'container'} ${styles.cartContainer} ${inPanel ? styles.inPanel : ''}`}>
      <h1 className={styles.title}>Səbət</h1>
      
      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {cart.map(item => (
            <div key={item.id} className={styles.cartItem}>
              <img src={item.img} alt={item.name} className={styles.itemImage} />
              <div className={styles.itemDetails}>
                <h3>{item.name}</h3>
                <p className={styles.itemPrice}>{item.price} AZN</p>
              </div>
              <div className={styles.quantityControls}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={16} /></button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16} /></button>
              </div>
              <p className={styles.itemTotal}>{(item.price * item.quantity).toFixed(2)} AZN</p>
              <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        
        <div className={styles.cartSummary}>
          <h2>Sifariş Xülasəsi</h2>
          <div className={styles.summaryRow}>
            <span>Məhsulların cəmi:</span>
            <span>{cartTotal.toFixed(2)} AZN</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Çatdırılma:</span>
            <span>0.00 AZN</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Yekun məbləğ:</span>
            <span>{cartTotal.toFixed(2)} AZN</span>
          </div>
          <button className={styles.checkoutBtn} onClick={handleCheckout}>Sifarişi Təsdiqlə</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
