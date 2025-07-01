import Order from '../models/Order.js';

// 🔹 User: Place an order
export const placeOrder = async (req, res) => {
  try {
    const { items, address, total, paymentMethod } = req.body;

    if (!items || !address || !total) {
      return res.status(400).json({ message: "Missing required order fields" });
    }

    const order = await Order.create({
      userId: req.user._id,
      deliveryDetails: address,
      items,
      total,
      paymentMethod,
      paymentStatus: "Pending",
      status: "Food Processing", // default
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 User: Get their own orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Admin: Update delivery status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 User: Cancel their order
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findOne({ _id: orderId, userId: req.user._id });

    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.deleteOne();
    res.json({ message: "Order canceled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
