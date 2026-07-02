// Import express to create a router
const express = require('express');
const router = express.Router();

// Import stripe and initialize it with our secret key from .env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST /api/stripe/create-checkout-session
// Receives cart items from React, creates a Stripe Checkout session, returns the session URL
router.post('/create-checkout-session', async (req, res) => {
  try {
    // req.body.items is the array of cart items sent from React
    const { items } = req.body;

    // Stripe needs each item formatted in a specific way ("line_items")
    // We convert our cart items into that format
    const line_items = items.map((item) => ({
      price_data: {
        // Note: LKR is not supported by Stripe
        // Using GBP for test mode - in a real deployment you would
        // convert LKR to a supported currency like USD before charging
        currency: 'gbp',
        product_data: {
          name: item.name, // shows on Stripe's checkout page
        },
        // Stripe expects the amount in the smallest currency unit
        // For GBP: pence (£1 = 100 pence)
        // We divide by 100 to get a reasonable GBP amount from LKR prices
        // e.g. Rs.1800 becomes £18.00 on Stripe checkout
        unit_amount: Math.round(item.price),
      },
      quantity: item.quantity,
    }));

    // Create the actual Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      // Where Stripe sends the user if payment succeeds
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      // Where Stripe sends the user if they cancel
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    // Send the session URL back to React, which will redirect the browser there
    res.json({ url: session.url });

  } catch (error) {
    res.status(500).json({ message: 'Failed to create checkout session', error: error.message });
  }
});

module.exports = router;