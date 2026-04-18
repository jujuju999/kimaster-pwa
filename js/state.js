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
    username: 'Lernender'
  };

  let state = { ...defaults };

  function load() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) state = { ...defaults, ...JSON.parse(saved) };
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
    } else {
      state.streak = 0;
    }
    state.lastLogin = today;
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
      state.xp += Math.round(task.xp * mult);
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

  function setUsername(name) { state.username = name; save(); }
  function setCurrentWeek(w) { state.currentWeek = w; save(); }

  function getAll() { return { ...state }; }

  load();
  return { isTaskDone, toggleTask, getLevel, getTodayTasks, getDoneCount, getTotalCount, answerQuiz, resetQuiz, setUsername, setCurrentWeek, getAll, save, checkAchievements };
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
