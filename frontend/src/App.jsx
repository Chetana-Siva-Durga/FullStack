import React, { useEffect, useState } from 'react'; // ✅ import useEffect
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Hotspot from './components/Hotspot/Hotspot';
import RestaurantMenu from './components/RestaurantMenu/RestaurantMenu';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import ExploreMenu from './components/ExploreMenu/ExploreMenu';
import FoodDisplay from './components/FoodDisplay/FoodDisplay';
import MyOrders from './pages/MyOrders/MyOrders';



// Cravings Page
const CravingsPage = () => {
  const [category, setCategory] = useState(null);

  return (
    <div>
      <h2 style={{ textAlign: 'center', margin: '2rem 0' }}>Cravings</h2>
      <ExploreMenu category={category} setCategory={setCategory} />
      {category && <FoodDisplay category={category} />}
    </div>
  );
};

const App = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/hotspots" element={<Hotspot />} />
        <Route path="/menu/:restaurantName" element={<RestaurantMenu />} />
        <Route path="/cravings" element={<CravingsPage />} />
        <Route path="/payment" element={<PaymentPage />} /> 
        <Route path="/orders" element={<MyOrders />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
