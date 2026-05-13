import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  products as initialProducts, 
  categories as initialCategories,
  badges as initialBadges,
  collections as initialCollectionsData
} from '../data/products';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('bame_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('bame_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('bame_badges');
    return saved ? JSON.parse(saved) : initialBadges;
  });

  const [collections, setCollections] = useState(() => {
    const saved = localStorage.getItem('bame_collections');
    return saved ? JSON.parse(saved) : initialCollectionsData;
  });

  useEffect(() => {
    localStorage.setItem('bame_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bame_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('bame_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('bame_collections', JSON.stringify(collections));
  }, [collections]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      rating: 5.0,
      reviews: 0,
      badge: product.badge || 'Yeni',
      collections: product.collections || []
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addCategory = (label) => {
    const id = label.toLowerCase().replace(/\s+/g, '-');
    if (categories.find(c => c.id === id)) return;
    setCategories(prev => [...prev, { id, label, img: '' }]);
  };

  const deleteCategory = (id) => {
    if (id === 'all') return;
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const updateCategoryImage = (id, newImg) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, img: newImg } : cat
    ));
  };

  const addBadge = (label) => {
    if (badges.includes(label)) return;
    setBadges(prev => [...prev, label]);
  };

  const deleteBadge = (label) => {
    setBadges(prev => prev.filter(b => b !== label));
  };

  const addCollection = (label) => {
    const id = label.toLowerCase().replace(/\s+/g, '-');
    if (collections.find(c => c.id === id)) return;
    setCollections(prev => [...prev, { id, label }]);
  };

  const deleteCollection = (id) => {
    setCollections(prev => prev.filter(c => c.id !== id));
  };

  const addComment = (productId, comment) => {
    const newComment = {
      ...comment,
      id: Date.now(),
      date: new Date().toLocaleDateString('az-AZ'),
    };
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, comments: [newComment, ...(p.comments || [])], reviews: (p.reviews || 0) + 1 } 
        : p
    ));
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      addProduct, 
      deleteProduct, 
      categories, 
      addCategory,
      deleteCategory,
      updateCategoryImage,
      badges,
      addBadge,
      deleteBadge,
      collections,
      addCollection,
      deleteCollection,
      addComment
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
