// ─── APP CONTROLLER ───
const App = (() => {
  let currentScreen = 'home';
  let deferredInstall = null;

  const screens = {
    home:    { el: 'screen-home',    nav: 'nav-home',    render: () => UI.renderHome() },
    weeks:   { el: 'screen-weeks',   nav: 'nav-weeks',   render: () => UI.renderWeeks() },
    quiz:    { el: 'screen-quiz',    nav: 'nav-quiz',    render: () => UI.renderQuiz() },
    profile: { el: 'screen-profile', nav: 'nav-profile', render: () => UI.renderProfile() }
  };

  function navigate(to) {
    if (!screens[to]) return;
    Object.keys(screens).forEach(key => {
      const s = screens[key];
      document.getElementById(s.el)?.classList.remove('active');
      document.getElementById(s.nav)?.classList.remove('active');
    });
    document.getElementById(screens[to].el)?.classList.add('active');
    document.getElementById(screens[to].nav)?.classList.add('active');
    currentScreen = to;
    screens[to].render();
    window.scrollTo(0, 0);
  }

  function checkOnboarding() {
    const s = State.getAll();
    if (!s.lastLogin || s.username === 'Lernender') {
      document.getElementById('screen-onboard').style.display = 'flex';
      document.getElementById('main-app').style.display = 'none';
    } else {
      startApp();
    }
  }

  function finishOnboarding() {
    const name = document.getElementById('onboard-name').value.trim();
    if (!name) { document.getElementById('onboard-name').focus(); return; }
    State.setUsername(name);
    document.getElementById('screen-onboard').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    startApp();
  }

  function startApp() {
    navigate('home');
    setupPWAInstall();
  }

  function setupPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstall = e;
      const btn = document.getElementById('install-btn');
      if (btn) btn.style.display = 'flex';
    });
    window.addEventListener('appinstalled', () => {
      const btn = document.getElementById('install-btn');
      if (btn) btn.style.display = 'none';
    });
  }

  async function installPWA() {
    if (!deferredInstall) return;
    deferredInstall.prompt();
    const { outcome } = await deferredInstall.userChoice;
    if (outcome === 'accepted') deferredInstall = null;
  }

  function init() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Nav buttons
    document.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', () => navigate(btn.dataset.nav));
    });

    // Onboarding
    document.getElementById('onboard-start')?.addEventListener('click', finishOnboarding);
    document.getElementById('onboard-name')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') finishOnboarding();
    });

    // Install btn
    document.getElementById('install-btn')?.addEventListener('click', installPWA);

    checkOnboarding();
  }

  return { navigate, init, installPWA, finishOnboarding };
})();

document.addEventListener('DOMContentLoaded', App.init);
