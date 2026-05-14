import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from '../common/ProductCard/ProductCard';
import styles from './GiftFinder.module.css';

const STEPS = [
  {
    id: 'recipient',
    question: 'Hədiyyəni kimin üçün alırsınız?',
    options: [
      { id: 'woman', label: 'Xanım üçün', icon: '💃' },
      { id: 'man', label: 'Bəy üçün', icon: '🤵' },
      { id: 'child', label: 'Uşaq üçün', icon: '👶' },
      { id: 'all', label: 'Hər kəsə uyğun', icon: '🎁' }
    ]
  },
  {
    id: 'budget',
    question: 'Büdcəniz nə qədərdir?',
    options: [
      { id: 'low', label: '0 - 50 AZN', icon: '💸' },
      { id: 'mid', label: '50 - 100 AZN', icon: '💰' },
      { id: 'high', label: '100+ AZN', icon: '💎' }
    ]
  },
  {
    id: 'style',
    question: 'Zövqü necədir?',
    options: [
      { id: 'minimal', label: 'Minimalist', icon: '✨' },
      { id: 'classic', label: 'Klassik', icon: '🏛️' },
      { id: 'modern', label: 'Müasir', icon: '⚡' },
      { id: 'creative', label: 'Yaradıcı', icon: '🎨' }
    ]
  }
];

const GiftFinder = () => {
  const { products } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const handleOptionSelect = (optionId) => {
    const newAnswers = { ...answers, [STEPS[currentStep].id]: optionId };
    setAnswers(newAnswers);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Nəticələri hesabla
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers) => {
    let filtered = [...products];

    // Büdcə filtrı
    if (finalAnswers.budget === 'low') filtered = filtered.filter(p => p.price <= 50);
    else if (finalAnswers.budget === 'mid') filtered = filtered.filter(p => p.price > 50 && p.price <= 100);
    else if (finalAnswers.budget === 'high') filtered = filtered.filter(p => p.price > 100);

    // Digər filtrlar (simulyasiya üçün random və ya bəzi açar sözlərə görə)
    // Real layihədə data-da 'tags' olmalıdır
    const recommendations = filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
    setResults(recommendations);
    setCurrentStep(STEPS.length); // Nəticə mərhələsinə keç
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResults(null);
  };

  return (
    <>
      <button className={styles.triggerBtn} onClick={() => setIsOpen(true)}>
        <Gift size={20} /> Hədiyyə Tapıcı
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>

              <div className={styles.modalContent}>
                {currentStep < STEPS.length ? (
                  <div className={styles.quizStep}>
                    <div className={styles.progress}>
                      Step {currentStep + 1} of {STEPS.length}
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill} 
                          style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} 
                        />
                      </div>
                    </div>
                    
                    <h2 className={styles.question}>{STEPS[currentStep].question}</h2>
                    
                    <div className={styles.optionsGrid}>
                      {STEPS[currentStep].options.map(option => (
                        <button 
                          key={option.id} 
                          className={styles.optionCard}
                          onClick={() => handleOptionSelect(option.id)}
                        >
                          <span className={styles.optionIcon}>{option.icon}</span>
                          <span className={styles.optionLabel}>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={styles.resultsSection}>
                    <h2 className={styles.resultTitle}>Sizin üçün seçimlərimiz ✨</h2>
                    <p className={styles.resultSub}>Cavablarınıza əsasən bu məhsulları bəyənə bilərsiniz.</p>
                    
                    <div className={styles.resultsGrid}>
                      {results && results.length > 0 ? (
                        results.map(product => (
                          <ProductCard key={product.id} product={product} />
                        ))
                      ) : (
                        <p>Təəssüf ki, kriteriyalara uyğun məhsul tapılmadı.</p>
                      )}
                    </div>

                    <div className={styles.resultActions}>
                      <button className={styles.resetBtn} onClick={resetQuiz}>
                        <RotateCcw size={18} /> Yenidən Başla
                      </button>
                      <button className={styles.shopBtn} onClick={() => setIsOpen(false)}>
                        Mağazaya Get <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GiftFinder;
