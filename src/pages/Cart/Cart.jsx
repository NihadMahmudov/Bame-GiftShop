import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Minus, Plus, MapPin, Phone } from 'lucide-react';
import styles from './Cart.module.css';

const Cart = ({ inPanel = false }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      alert("Sifariş vermək üçün daxil olmalısınız.");
      return;
    }
    if (!address || !phone) {
      alert("Zəhmət olmasa ünvan və əlaqə nömrənizi daxil edin.");
      return;
    }

    addOrder({
      userEmail: user.email,
      customerName: user.name,
      address,
      phone,
      items: cart,
      total: cartTotal
    });
    
    setOrderSuccess(true);
    clearCart();
    setTimeout(() => setOrderSuccess(false), 5000);
  };

  if (orderSuccess) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.successAnimation}>
          <h2>Təbriklər! 🎉</h2>
          <p>Sifarişiniz Bame Adminə göndərildi.</p>
          <p>Təsdiqləndikdən sonra "Sifarişlərim" bölməsindən izləyə bilərsiniz.</p>
        </div>
      </div>
    );
  }

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
                <p className={styles.itemPrice}>{item.price} ₼</p>
                <div className={styles.itemBottom}>
                  <div className={styles.quantityControls}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                  </div>
                  <p className={styles.itemTotal}>{(item.price * item.quantity).toFixed(2)} ₼</p>
                </div>
              </div>
              <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                <Trash2 size={18} />
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

          <div className={styles.checkoutForm}>
            <h3>Çatdırılma Məlumatları</h3>
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <MapPin size={18} />
                <input 
                  type="text" 
                  placeholder="Çatdırılma ünvanı (Məs: 28 May m/s)" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <Phone size={18} />
                <input 
                  type="text" 
                  placeholder="WhatsApp nömrəniz (+994...)" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <button className={styles.checkoutBtn} onClick={handleCheckout}>Sifarişi Tamamla</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
