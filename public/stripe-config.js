// ═══════════════════════════════════════════════════════
//  LaunchPath AI — Stripe Configuration
//  from dashboard.stripe.com
// ═══════════════════════════════════════════════════════

const LP_STRIPE = {

  // ── PAYMENT LINK ──────────────────────────────────────
  // Hosted Stripe Payment Link for $25/month
  // Found in: Stripe Dashboard → Payment Links
  // After signup, user is redirected here with ?client_reference_id=USER_ID
  //
  // IMPORTANT: Set the success redirect URL inside the Stripe Dashboard
  //   Payment Link → Edit → After payment → Redirect to: payment-success.html
  //
  // TEST:  https://buy.stripe.com/test_XXXXXXXX
  // LIVE:  https://buy.stripe.com/XXXXXXXX

  checkoutUrl: 'https://buy.stripe.com/aFa3cvgkRgxW9B47Uy8Vi01',

};
