import React from 'react';
import Hero from '../../components/home/Hero';
import FlashSale from '../../components/home/FlashSale';
import RecentlyViewed from '../../components/home/RecentlyViewed';
import GiftFinder from '../../components/home/GiftFinder';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <FlashSale />
      <RecentlyViewed />
      <GiftFinder />
    </div>
  );
};

export default Home;
