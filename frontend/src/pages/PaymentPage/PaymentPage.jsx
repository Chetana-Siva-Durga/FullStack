import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./PaymentPage.css";

const PaymentPage = () => {
  const { cartItems, food_list, addresses, grandTotal, clearCart } = useContext(StoreContext);
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const selectedAddress = addresses[0];
  const cartItemsList = food_list.filter(item => cartItems[item._id] > 0);

  const handleCOD = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items: cartItemsList.map(item => ({
            id: item._id,
            name: item.name,
            quantity: cartItems[item._id],
            price: parseFloat(item.price.toString().replace(/[^0-9.]/g, "")),
          })),
          address: selectedAddress,
          total: grandTotal,
          paymentMethod: "COD",
        }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error("Order placement error:", err);
      alert("Could not place your order. Please try again.");
    }
  };

  useEffect(() => {
    if (orderPlaced) {
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/');
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [orderPlaced, navigate]);

  return (
    <div className="payment-page">
      <h1>Payment & Order Review</h1>

      {orderPlaced ? (
        <div className="order-success">
          🎉 <strong>Order placed successfully!</strong>
          <p>Redirecting to home in {countdown}...</p>
        </div>
      ) : (
        <div className="payment-container">
          {/* Delivery Address */}
          <section className="payment-section">
            <div className="section-header">
              <h2>Delivery Information</h2>
              <button className="edit-button" onClick={() => navigate('/placeorder')}>✏️ Edit</button>
            </div>
            {selectedAddress ? (
              <div className="delivery-details">
                <p><strong>{selectedAddress.firstName} {selectedAddress.lastName}</strong></p>
                <p>{selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
                <p>{selectedAddress.country}</p>
                <p>Email: {selectedAddress.email}</p>
                <p>Phone: {selectedAddress.phone}</p>
              </div>
            ) : (
              <p>No address selected. Please add one before proceeding.</p>
            )}
          </section>

          {/* Order Summary */}
          <section className="payment-section">
            <div className="section-header">
              <h2>Order Summary</h2>
              <button className="edit-button" onClick={() => navigate('/cravings')}>➕ Add More</button>
            </div>
            {cartItemsList.length ? (
              <ul className="cart-items-list">
                {cartItemsList.map(item => {
                  const quantity = cartItems[item._id];
                  const priceNum = parseFloat(item.price.toString().replace(/[^0-9.]/g, ""));
                  return (
                    <li key={item._id}>
                      <p><strong>{item.name}</strong> x {quantity}</p>
                      <p>₹ {(priceNum * quantity).toFixed(2)}</p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>Your cart is empty.</p>
            )}
            <div className="summary-line"><span>Delivery Charges:</span><span>₹ 50.00</span></div>
            <div className="total-line">
              <strong>Grand Total:</strong>
              <strong>₹ {grandTotal.toFixed(2)}</strong>
            </div>
          </section>

          {/* Payment Options */}
          <section className="payment-section">
            <h2>Choose Payment Method</h2>
            <button
              onClick={handleCOD}
              className="payment-button cod"
              disabled={!selectedAddress || !cartItemsList.length}
            >
              🏠 Cash on Delivery
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
