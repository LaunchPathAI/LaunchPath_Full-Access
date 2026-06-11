// public/auth-guard.js
(async function () {
  // Ensure config and supabase are loaded
  if (typeof LP_CONFIG === 'undefined' || typeof supabase === 'undefined') {
    console.error('Configuration or Supabase SDK not found. Redirecting to login.');
    window.location.href = 'student-login.html';
    return;
  }

  const _supabase = supabase.createClient(LP_CONFIG.SUPABASE_URL, LP_CONFIG.SUPABASE_ANON_KEY);

  // 1. Check if user is logged in
  const { data: { session }, error: sessionError } = await _supabase.auth.getSession();

  if (sessionError || !session) {
    window.location.href = 'student-login.html';
    return;
  }

  // 2. Check if user has paid
  const { data: profile, error: profileErr } = await _supabase
    .from('profiles')
    .select('is_paid')
    .eq('id', session.user.id)
    .single();

  if (profileErr || !profile) {
    window.location.href = 'student-login.html';
    return;
  }

  if (!profile.is_paid) {
    // They have an account but haven't paid. 
    // Sending them to login page will auto-trigger the Stripe redirect.
    window.location.href = 'student-login.html';
    return;
  }

  // Success! User is authenticated and paid.
  console.log('Auth check passed. User is authorized.');

  // Handle Sign In buttons dynamically
  // Handle Sign In buttons dynamically (no DOMContentLoaded wait needed because of async delays)
  const updateButtons = () => {
    const signinLinks = document.querySelectorAll('a[href="student-login.html"], .signin');
    signinLinks.forEach(link => {
      link.textContent = 'Sign Out';
      link.href = '#';
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        await _supabase.auth.signOut();
        window.location.href = 'student-login.html';
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateButtons);
  } else {
    updateButtons();
  }
})();
