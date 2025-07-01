import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided in request" });
    }

    // Build line items from cart
    const line_items = items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100), // Stripe uses paise
      },
      quantity: item.quantity,
    }));

    // Add delivery charge as a separate line item
    line_items.push({
      price_data: {
        currency: 'inr',
        product_data: { name: 'Delivery Charge' },
        unit_amount: 5000, // ₹50.00 delivery fee
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
      metadata: {
        customer_email: address?.email || 'no-email-provided',
        address: JSON.stringify(address || {}),
      },
      shipping_address_collection: {
        allowed_countries: ['IN'],
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("❌ Stripe checkout session error:", error);
    res.status(500).json({ message: "Could not create checkout session", error: error.message });
  }
});

export default router;
