import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import Hotspot from '../../components/Hotspot/Hotspot';
import About from '../../components/About/About';
import Contact from '../../components/Contact/Contact'; // ✅ Import your Contact component

const Home = () => {
  const [category, setCategory] = useState(null);

  return (
    <div>
      <div id="home-section">
        <Header />
      </div>

      <div id="cravings-section">
        <ExploreMenu category={category} setCategory={setCategory} />
        {category && <FoodDisplay category={category} />}
      </div>

      <div id="hotspots-section">
        <Hotspot />
      </div>

      <div id="about-section">
        <About />
      </div>

      <div id="contact-section"> {/* ✅ Contact section added for smooth scroll */}
        <Contact />
      </div>
    </div>
  );
};

export default Home;
