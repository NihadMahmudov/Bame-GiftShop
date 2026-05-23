import React from 'react';
import Hero from '../../components/home/Hero';
import FlashSale from '../../components/home/FlashSale';
import RecentlyViewed from '../../components/home/RecentlyViewed';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <FlashSale />
      <RecentlyViewed />
    </div>
  );
};

export default Home;
