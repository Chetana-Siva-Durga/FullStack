import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    grandTotal, // ✅ Get grandTotal directly from context
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // Calculate subtotal by stripping ₹ or $ from price strings
  let subtotal = 0;
  food_list.forEach(item => {
    const quantity = cartItems[item._id];
    if (quantity > 0) {
      const priceNum = parseFloat(item.price.toString().replace(/[^0-9.]/g, ""));
      subtotal += priceNum * quantity;
    }
  });

  const deliveryFee = subtotal === 0 ? 0 : 50;

  const hasItemsInCart = Object.values(cartItems).some(qty => qty > 0);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />

        {hasItemsInCart ? (
          food_list.map((item) => {
            const quantity = cartItems[item._id];
            if (quantity > 0) {
              const priceNum = parseFloat(item.price.toString().replace(/[^0-9.]/g, ""));
              const itemTotal = priceNum * quantity;

              return (
                <div key={item._id}>
                  <div className="cart-items-title cart-items-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => e.target.src = "https://via.placeholder.com/60x60?text=No+Image"}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px"
                      }}
                    />
                    <p>{item.name}</p>
                    <p>₹ {priceNum.toFixed(2)}</p>
                    <p>{quantity}</p>
                    <p>₹ {itemTotal.toFixed(2)}</p>
                    <p onClick={() => removeFromCart(item._id)} className="cross">×</p>
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          })
        ) : (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
            Your cart is empty.
          </p>
        )}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹ {subtotal.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹ {deliveryFee.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹ {grandTotal.toFixed(2)}</b>
            </div>
          </div>
          <button
            disabled={subtotal === 0}
            onClick={() => navigate('/placeorder')}
            style={{ opacity: subtotal === 0 ? 0.6 : 1 }}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <p>If you have a promo code, enter it here:</p>
          <div className="cart-promocode-input">
            <input type="text" placeholder="Promo code" />
            <button
              disabled={!hasItemsInCart}
              style={{
                opacity: hasItemsInCart ? 1 : 0.6,
                cursor: hasItemsInCart ? "pointer" : "not-allowed"
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
