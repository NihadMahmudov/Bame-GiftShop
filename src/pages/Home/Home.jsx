import React from 'react';
import Hero from '../../components/home/Hero';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      
      {/* Featured Collections, Best Sellers və s. bura əlavə olunacaq */}
      <section style={{ padding: '100px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title">Yeni Kolleksiyalarımız</h2>
          <p>Tezliklə burada ən özəl hədiyyələri görəcəksiniz.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
