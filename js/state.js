const State = (() => {
  const KEY = 'kimastery_v1';

  const defaults = {
    done: [],
    xp: 0,
    streak: 0,
    lastLogin: null,
    achievements: [],
    quizAnswers: {},
    quizPoints: 0,
    currentWeek: 0,
    theme: 'dark',
    username: 'Lernender',
    shields: 1,
    streak_protected: false,
    dailyGoal: 0,
    todayXP: 0,
    todayDate: '',
    loginHistory: [],
    completedWeeks: [],
    blitzDate: '',
    blitzQuestionIds: [],
    blitzAnswers: {},
    blitzScore: 0,
    blitzXP: 0,
    blitzCompleted: false
  };

  let state = { ...defaults };
  let _shieldSaved = false;

  function load() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) state = { ...defaults, ...JSON.parse(saved) };
      if (state.shields === undefined) state.shields = 1;
      if (!state.loginHistory) state.loginHistory = [];
      if (!state.completedWeeks) state.completedWeeks = [];
      // Daily XP reset
      const today = new Date().toISOString().split('T')[0];
      if (state.todayDate !== today) {
        if (state.todayDate && state.todayXP > 0) {
          state.loginHistory = [{ date: state.todayDate, xp: state.todayXP }, ...state.loginHistory].slice(0, 90);
        }
        state.todayXP = 0;
        state.todayDate = today;
      }
      checkStreak();
    } catch(e) { state = { ...defaults }; }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e) {}
  }

  function checkStreak() {
    const today = new Date().toDateString();
    const last = state.lastLogin;
    if (!last) { state.lastLogin = today; save(); return; }
    if (last === today) return;
    const yesterday = new Date(Date.now() - 864e5).toDateString();
    if (last === yesterday) {
      state.streak += 1;
      state.streak_protected = false;
    } else {
      if (state.shields > 0) {
        state.shields -= 1;
        state.streak_protected = true;
        _shieldSaved = true;
      } else {
        state.streak = 0;
        state.streak_protected = false;
      }
    }
    state.lastLogin = today;
    save();
  }

  function buyShield() {
    if (state.shields >= 3) return { error: 'max' };
    if (state.xp < 100) return { error: 'xp' };
    state.xp -= 100;
    state.shields += 1;
    save();
    return { ok: true };
  }

  function consumeShieldToast() {
    const v = _shieldSaved;
    _shieldSaved = false;
    return v;
  }

  function setDailyGoal(n) { state.dailyGoal = n; save(); }

  function getTodayProgress() {
    const pct = state.dailyGoal > 0 ? Math.min(state.todayXP / state.dailyGoal, 1) : 0;
    return { xp: state.todayXP, goal: state.dailyGoal, pct };
  }

  function markWeekComplete(wi) {
    if (state.completedWeeks.includes(wi)) return false;
    state.completedWeeks.push(wi);
    save();
    return true;
  }

  function syncCompletedWeeks() {
    if (typeof DATA === 'undefined' || !DATA.weeks) return;
    DATA.weeks.forEach((w, wi) => {
      const total = w.days.reduce((s, d) => s + d.tasks.length, 0);
      const done  = w.days.reduce((s, d) => s + d.tasks.filter(t => state.done.includes(t.id)).length, 0);
      if (done === total && total > 0 && !state.completedWeeks.includes(wi)) {
        state.completedWeeks.push(wi);
      }
    });
    save();
  }

  function isTaskDone(id) { return state.done.includes(id); }

  function toggleTask(task) {
    const idx = state.done.indexOf(task.id);
    if (idx > -1) {
      state.done.splice(idx, 1);
      state.xp = Math.max(0, state.xp - task.xp);
    } else {
      state.done.push(task.id);
      const mult = state.streak >= 7 ? DATA.meta.streakBonus : 1;
      const earned = Math.round(task.xp * mult);
      state.xp += earned;
      state.todayXP += earned;
      checkAchievements(task);
    }
    save();
  }

  function getLevel() {
    const lvls = DATA.levels;
    let cur = lvls[0];
    for (const l of lvls) { if (state.xp >= l.minXP) cur = l; }
    const idx = lvls.indexOf(cur);
    const next = lvls[idx + 1];
    const progress = next
      ? (state.xp - cur.minXP) / (next.minXP - cur.minXP)
      : 1;
    return { ...cur, next, progress, idx };
  }

  function getTodayTasks() {
    const day = new Date().getDay(); // 0=Sun
    const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Sun→6, Mon→0
    const mappedDay = dayMap[day];
    const week = DATA.weeks[state.currentWeek];
    if (!week || !week.days[mappedDay]) return week ? week.days[0] : DATA.weeks[0].days[0];
    return week.days[mappedDay];
  }

  function getDoneCount(weekId) {
    const week = DATA.weeks[weekId];
    if (!week) return 0;
    return week.days.reduce((s, d) => s + d.tasks.filter(t => state.done.includes(t.id)).length, 0);
  }

  function getTotalCount(weekId) {
    const week = DATA.weeks[weekId];
    if (!week) return 0;
    return week.days.reduce((s, d) => s + d.tasks.length, 0);
  }

  function checkAchievements(task) {
    const add = (id) => {
      if (!state.achievements.includes(id)) {
        state.achievements.push(id);
        const ach = DATA.achievements.find(a => a.id === id);
        if (ach) { state.xp += ach.xp; showAchievement(ach); }
      }
    };
    if (state.done.length === 1) add('first_task');
    if (state.streak >= 3) add('streak_3');
    if (state.streak >= 7) add('streak_7');
    if (task.type === 'theory' && DATA.weeks[0].days.every(d =>
      d.tasks.filter(t => t.type === 'theory').every(t => state.done.includes(t.id))
    )) add('all_theory');
    if (getDoneCount(0) === getTotalCount(0)) add('week1_done');
    const totalAll = DATA.weeks.reduce((s, w) => s + w.days.reduce((s2, d) => s2 + d.tasks.length, 0), 0);
    if (state.done.length === totalAll) add('phase1_done');
  }

  function answerQuiz(qid, optIdx) {
    if (state.quizAnswers[qid] !== undefined) return null;
    const q = DATA.quiz.find(q => q.id === qid);
    if (!q) return null;
    const correct = optIdx === q.correct;
    state.quizAnswers[qid] = optIdx;
    if (correct) { state.xp += DATA.meta.xpPerQuiz; state.quizPoints++; }
    const allAnswered = DATA.quiz.every(q => state.quizAnswers[q.id] !== undefined);
    if (allAnswered && state.quizPoints === DATA.quiz.length && !state.achievements.includes('quiz_perfect')) {
      state.achievements.push('quiz_perfect');
      const ach = DATA.achievements.find(a => a.id === 'quiz_perfect');
      if (ach) { state.xp += ach.xp; showAchievement(ach); }
    }
    save();
    return { correct, explanation: q.exp };
  }

  function resetQuiz() {
    state.quizAnswers = {};
    state.quizPoints = 0;
    save();
  }

  function initBlitz() {
    const today = new Date().toISOString().split('T')[0];
    if (state.blitzDate !== today) {
      const pool = DATA.blitzQuestions.slice();
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      state.blitzDate = today;
      state.blitzQuestionIds = pool.slice(0, 3).map(q => q.id);
      state.blitzAnswers = {};
      state.blitzScore = 0;
      state.blitzXP = 0;
      state.blitzCompleted = false;
      save();
    }
    return getBlitz();
  }

  function getBlitz() {
    const questions = state.blitzQuestionIds
      .map(id => DATA.blitzQuestions.find(q => q.id === id))
      .filter(Boolean);
    return {
      questions,
      answers: { ...state.blitzAnswers },
      score: state.blitzScore,
      xp: state.blitzXP,
      completed: state.blitzCompleted
    };
  }

  function answerBlitz(qid, answerIdx) {
    if (state.blitzAnswers[qid] !== undefined) return null;
    const q = DATA.blitzQuestions.find(q => q.id === qid);
    if (!q) return null;
    const correct = answerIdx === q.correct;
    state.blitzAnswers[qid] = answerIdx;
    if (correct) {
      state.blitzScore++;
      state.blitzXP += 15;
      state.xp += 15;
      state.todayXP += 15;
    }
    save();
    return { correct, explanation: q.exp, xpEarned: correct ? 15 : 0 };
  }

  function completeBlitz() {
    if (state.blitzCompleted) return { score: state.blitzScore, xp: state.blitzXP };
    state.blitzCompleted = true;
    if (state.blitzScore === 3) {
      state.xp += 20;
      state.todayXP += 20;
      state.blitzXP += 20;
    }
    save();
    return { score: state.blitzScore, xp: state.blitzXP };
  }

  function setUsername(name) { state.username = name; save(); }
  function setCurrentWeek(w) { state.currentWeek = w; save(); }

  function getAll() { return { ...state }; }

  load();
  return { isTaskDone, toggleTask, getLevel, getTodayTasks, getDoneCount, getTotalCount, answerQuiz, resetQuiz, setUsername, setCurrentWeek, getAll, save, checkAchievements, buyShield, consumeShieldToast, setDailyGoal, getTodayProgress, markWeekComplete, syncCompletedWeeks, initBlitz, getBlitz, answerBlitz, completeBlitz };
})();

function showAchievement(ach) {
  const el = document.getElementById('achievement-toast');
  if (!el) return;
  el.querySelector('.ach-icon').textContent = ach.icon;
  el.querySelector('.ach-title').textContent = ach.title;
  el.querySelector('.ach-desc').textContent = ach.desc + ` (+${ach.xp} XP)`;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3500);
}
