import React from 'react';
import './About.css';
import aboutImage from './img.png'; // Replace with your actual image filename in About folder

const About = () => {
  return (
    <div className="about-section" id="about-section">
      <div className="about-container">
        <div className="about-text">
          <h2 className="about-title">Why Choose Flavour Dash?</h2>

          <ul className="about-points">
            <li>🚀 <b>Fast Delivery:</b> Your food at your door, hot & quick!</li>
            <li>🍽️ <b>Fresh & Tasty:</b> Quality ingredients, every single time.</li>
            <li>📍 <b>Top Restaurants:</b> Handpicked local favorites .</li>
            <li>🛒 <b>Seamless Ordering:</b> One-click checkout for ultimate convenience.</li>
            <li>❤️ <b>Customer First:</b> 24/7 support for your cravings.</li>
          </ul>

          <p className="about-description">
            At <b>Flavour Dash</b>, we redefine food delivery with speed, freshness, and unbeatable variety. Experience the taste revolution today!
          </p>
        </div>
        <div className="about-image">
          <img src={aboutImage} alt="About Flavour Dash" />
        </div>
      </div>
    </div>
  );
};

export default About;
