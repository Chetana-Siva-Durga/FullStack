import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deliveryDetails: { type: Object, required: true },
  items: [{ id: String, name: String, quantity: Number, price: Number }],
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: "COD" },
  paymentStatus: { type: String, default: "Pending" },
  status: { type: String, default: "Food Processing" }, // ✅ Admin will update this
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
