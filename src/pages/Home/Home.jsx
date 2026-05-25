import React from 'react';
import Hero from '../../components/home/Hero';
import FeatureBar from '../../components/home/FeatureBar';
import FlashSale from '../../components/home/FlashSale';
import ProductShowcase from '../../components/home/ProductShowcase';
import RecentlyViewed from '../../components/home/RecentlyViewed';
import GiftFinder from '../../components/home/GiftFinder';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <FeatureBar />
      <FlashSale />
      <ProductShowcase />
      <RecentlyViewed />
      <GiftFinder />
    </div>
  );
};

export default Home;
