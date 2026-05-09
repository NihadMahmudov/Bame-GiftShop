import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Hero.module.css';

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDiscover = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
    } else {
      navigate('/panel');
    }
  };
  return (
    <section className={styles.hero}>
      <div className={styles.heroOverlay}></div>
      <div className={`container ${styles.heroContainer}`}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Eksklüziv Hədiyyə Kolleksiyası
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Hər Bir Hədiyyə <br /> Bir <span>Hekayədir</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Ən sevdikləriniz üçün unudulmaz və zərif hədiyyələrin ünvanı. 
            Keyfiyyət və estetikamızla hər anı özəlləşdiririk.
          </motion.p>
          <motion.div 
            className={styles.actions}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <button onClick={handleDiscover} className={styles.primaryBtn}>
              Kolleksiyanı Kəşf Et <ArrowRight size={18} />
            </button>
            <button className={styles.secondaryBtn}>
              Haqqımızda
            </button>
          </motion.div>
        </motion.div>
      </div>
      
      <div className={styles.scrollIndicator}>
        <div className={styles.mouse}></div>
      </div>
    </section>
  );
};

export default Hero;
