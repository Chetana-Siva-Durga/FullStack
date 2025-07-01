import React, { useState } from 'react';
import './Contact.css';
import chefImage from './girl.jpg'; // Make sure this image exists in your Contact folder

const Contact = () => {
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xkgbkgeg', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setSuccessMessage('Message sent successfully!');
        form.reset();
      } else {
        setSuccessMessage('Oops! Something went wrong.');
      }
    } catch (error) {
      setSuccessMessage('Oops! Could not send message.');
    }

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <section className="contact-section" id="contact-section">
      <div className="contact-container">
        <div className="contact-image-container">
          <img src={chefImage} alt="Excited Chef" className="contact-chef-image" />
        </div>

        <div className="contact-content">
          <h2 className="contact-title">Get in Touch with Flavour Dash</h2>
          <p className="contact-description">
            Have questions or feedback? We’d love to hear from you! Reach us using the form or details below.
          </p>

          <ul className="contact-details">
            <li><i className="fas fa-map-marker-alt"></i> Guntur, Andhra Pradesh, India</li>
            <li><i className="fas fa-phone"></i> <a href="tel:+919393045999">+91 93930 45999</a></li>
            <li><i className="fas fa-envelope"></i> <a href="mailto:chetanasivadurga@gmail.com">chetanasivadurga@gmail.com</a></li>
          </ul>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Your Name" required />
            <input type="email" name="email" placeholder="Your Email" required />
            <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Send Message</button>
          </form>

          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
      </div>
    </section>
  );
};

export default Contact;
