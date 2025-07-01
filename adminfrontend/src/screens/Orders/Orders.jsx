import { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/orders/list`);
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error.message);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      await axios.put(`${url}/api/orders/status`, {
        orderId,
        status: e.target.value,
      });
      fetchAllOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

   useEffect(() => {
  fetchAllOrders();
  const interval = setInterval(fetchAllOrders, 5000); // fetch every 5 seconds

  return () => clearInterval(interval); // cleanup on unmount
}, []);


  return (
    <div className="screen order">
      <h3 className="order-heading">Order Page</h3>
      <div className="order-list">
        {orders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.name} x {item.quantity}
                      {idx < order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
                <p className="order-item-name">
                  {order.deliveryDetails?.firstName} {order.deliveryDetails?.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.deliveryDetails?.street}</p>
                  <p>
                    {order.deliveryDetails?.city}, {order.deliveryDetails?.state}, {order.deliveryDetails?.country} - {order.deliveryDetails?.zip}
                  </p>
                </div>
                <p className="order-item-phone">{order.deliveryDetails?.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>₹{order.total?.toFixed(2)}</p>
              <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                <option value="Food Processing">Food Processing</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
