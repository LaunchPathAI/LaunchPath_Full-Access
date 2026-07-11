// public/public-auth.js
(async function () {
  if (typeof LP_CONFIG === 'undefined' || typeof supabase === 'undefined') {
    return;
  }

  const _supabase = supabase.createClient(LP_CONFIG.SUPABASE_URL, LP_CONFIG.SUPABASE_ANON_KEY);
  const { data: { session } } = await _supabase.auth.getSession();

  if (session) {
    const updateButtons = () => {
      const signinLinks = document.querySelectorAll('a[href="student-login.html"], .signin');
      const workspaceBtn = document.getElementById('navWorkspaceBtn');
      if (workspaceBtn) {
        workspaceBtn.style.display = '';
      }
      const askLpBtn = document.getElementById('navAskLpBtn');
      if (askLpBtn) {
        askLpBtn.style.display = '';
      }
      signinLinks.forEach(link => {
        link.textContent = 'Sign Out';
        link.href = '#';
        link.classList.remove('signin');
        link.addEventListener('click', async (e) => {
          e.preventDefault();
          await _supabase.auth.signOut();
          window.location.reload(); // Reload the public page after sign out
        });
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', updateButtons);
    } else {
      updateButtons();
    }
  }
})();
