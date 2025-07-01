import React, { useEffect, useState } from "react";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  const confirmCancel = (orderId) => {
    setOrderToCancel(orderId);
    setShowConfirm(true);
  };

  const handleCancel = async () => {
    if (!orderToCancel) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderToCancel}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to cancel order");
      await fetchOrders();
      setShowConfirm(false);
      setOrderToCancel(null);
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order.");
    }
  };

  return (
    <div className="orders-page">
      <h1>🛒 My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map((order) => {
          const totalAmount = order.total?.toFixed(2);
          const isCancelable = order.status === "Food Processing"; // ✅ Only cancelable at this stage

          return (
            <div className="order-item-horizontal" key={order._id}>
              <div className="order-info">
                <div className="order-id">
                  <h3>Order ID: {order._id}</h3>
                </div>
                <div className="order-items">
                  <h4>Items:</h4>
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        🍽️ {item.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="order-summary">
                  <p><strong>Total Amount:</strong> ₹ {totalAmount}</p>
                  <p>
                    <strong>Delivery Address:</strong>{" "}
                    {order.deliveryDetails && (
                      <>
                        {order.deliveryDetails.firstName}{" "}
                        {order.deliveryDetails.lastName},{" "}
                        {order.deliveryDetails.street},{" "}
                        {order.deliveryDetails.city},{" "}
                        {order.deliveryDetails.state},{" "}
                        {order.deliveryDetails.zip},{" "}
                        {order.deliveryDetails.country}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="order-status">
                <p className="pending-status">
                  📦 Status: <strong>{order.status || "Food Processing"}</strong>
                </p>
                {/* ✅ Only show cancel button if status is 'Food Processing' */}
                {isCancelable && (
                  <button
                    className="cancel-button"
                    onClick={() => confirmCancel(order._id)}
                  >
                    ❌ Cancel Order
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}

      {showConfirm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Are you sure?</h2>
            <p>Do you really want to cancel this order?</p>
            <div className="modal-buttons">
              <button className="confirm" onClick={handleCancel}>
                Yes, Cancel
              </button>
              <button className="cancel" onClick={() => setShowConfirm(false)}>
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
