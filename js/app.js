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
      document.getElementById(screens[key].el)?.classList.remove('active');
      document.getElementById(screens[key].nav)?.classList.remove('active');
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
    document.getElementById('screen-onboard').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    startApp();
  }

  function startApp() {
    State.syncCompletedWeeks();
    navigate('home');
    setupPWAInstall();
    if (State.consumeShieldToast()) {
      setTimeout(() => UI.showToast('Dein Streak wurde durch einen Schutz gerettet!', '🛡️'), 800);
    }
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
    // Service Worker — korrekter Pfad für GitHub Pages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/kimaster-pwa/sw.js', {
        scope: '/kimaster-pwa/'
      }).then(reg => {
        console.log('SW registered:', reg.scope);
      }).catch(err => {
        console.log('SW error:', err);
      });
    }

    document.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', () => navigate(btn.dataset.nav));
    });

    document.getElementById('onboard-next-1')?.addEventListener('click', obNext1);
    document.getElementById('onboard-next-2')?.addEventListener('click', obNext2);
    document.getElementById('onboard-start')?.addEventListener('click', finishOnboarding);
    document.getElementById('onboard-name')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') obNext1();
    });

    document.getElementById('install-btn')?.addEventListener('click', installPWA);

    checkOnboarding();
  }

  return { navigate, init, installPWA, finishOnboarding };
})();

document.addEventListener('DOMContentLoaded', App.init);
