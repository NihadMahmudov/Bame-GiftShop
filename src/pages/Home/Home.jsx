import React from 'react';
import Hero from '../../components/home/Hero';
import FlashSale from '../../components/home/FlashSale';
import RecentlyViewed from '../../components/home/RecentlyViewed';
import GiftFinder from '../../components/home/GiftFinder';
import StoryBar from '../../components/social/StoryBar/StoryBar';

const Home = () => {
  return (
    <div className="home-page">
      <StoryBar />
      <Hero />
      <FlashSale />
      <RecentlyViewed />
      <GiftFinder />
    </div>
  );
};

export default Home;
