// ═══════════════════════════════════════════════════════
//  LaunchPath AI — Stripe Configuration
//  Replace placeholder values with your real Stripe keys
//  from dashboard.stripe.com
// ═══════════════════════════════════════════════════════

const LP_STRIPE = {

  // ── KEYS ──────────────────────────────────────────────
  // Publishable key: starts with pk_live_ or pk_test_
  // Found in: Stripe Dashboard → Developers → API Keys
  publishableKey: 'pk_live_REPLACE_WITH_YOUR_PUBLISHABLE_KEY',

  // ── PRICE ID ──────────────────────────────────────────
  // Your $25/month recurring price ID: starts with price_
  // To create: Stripe Dashboard → Products → Add Product
  //   Name: LaunchPath AI Student Subscription
  //   Price: $25.00 USD / month (recurring)
  //   Copy the Price ID and paste below
  priceId: 'price_REPLACE_WITH_YOUR_PRICE_ID',

  // ── URLS ──────────────────────────────────────────────
  // Where Stripe sends the student after successful payment
  successUrl: 'https://YOURSITE.github.io/success.html?session_id={CHECKOUT_SESSION_ID}',

  // Where Stripe sends the student if they cancel checkout
  cancelUrl: 'https://YOURSITE.github.io/student-profile.html',

  // ── PRODUCT INFO ──────────────────────────────────────
  productName: 'LaunchPath AI',
  productDescription: 'Full access — College Match, Essay Studio, ROI Calculator, Scattergram, Social Studio & LP Guide',
  amount: 2500, // in cents = $25.00
  currency: 'usd',
  interval: 'month'
};
