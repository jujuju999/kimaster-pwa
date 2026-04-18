const UI = (() => {

  // ─── XP POP ANIMATION ───
  function xpPop(xp, x, y) {
    const el = document.createElement('div');
    el.className = 'xp-pop';
    el.textContent = `+${xp} XP`;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }

  // ─── CONFETTI ───
  function confetti() {
    const colors = ['#39d98a','#f59e0b','#a78bfa','#f87171','#60a5fa','#fff'];
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        el.style.left = Math.random() * 100 + 'vw';
        el.style.top = '-20px';
        el.style.background = colors[Math.floor(Math.random() * colors.length)];
        el.style.animationDuration = (1 + Math.random()) + 's';
        el.style.animationDelay = (Math.random() * 0.5) + 's';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2500);
      }, i * 60);
    }
  }

  // ─── RENDER HOME ───
  function renderHome() {
    const s = State.getAll();
    const lv = State.getLevel();

    // greeting
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Moin' : 'Guten Abend';
    document.getElementById('h-greet').textContent = greet + ',';
    document.getElementById('h-name').textContent = s.username;

    // xp bar
    document.getElementById('h-level').textContent = `Level ${lv.level} · ${lv.title}`;
    document.getElementById('h-xp').textContent = `${s.xp} XP${lv.next ? ' / ' + lv.next.minXP : ''}`;
    document.getElementById('h-xp-fill').style.width = Math.round(lv.progress * 100) + '%';

    // stats
    const totalDone = DATA.weeks.reduce((s2, w) => s2 + w.days.reduce((s3, d) => s3 + d.tasks.filter(t => s.done.includes(t.id)).length, 0), 0);
    const totalAll = DATA.weeks.reduce((s2, w) => s2 + w.days.reduce((s3, d) => s3 + d.tasks.length, 0), 0);
    document.getElementById('h-stat-xp').textContent = s.xp;
    document.getElementById('h-stat-streak').textContent = s.streak;
    document.getElementById('h-stat-done').textContent = totalDone + '/' + totalAll;

    // streak card
    const streakNum = document.getElementById('h-streak-num');
    if (streakNum) streakNum.innerHTML = s.streak + (s.shields > 0 ? ' <span style="font-size:18px;">🛡️</span>' : '');
    document.getElementById('h-streak-sub').textContent = s.streak > 0
      ? `${s.streak} Tag${s.streak !== 1 ? 'e' : ''} in Folge — weiter so!`
      : 'Starte heute deinen Streak!';

    // goal ring
    const s2 = State.getAll();
    const ringCard = document.getElementById('goal-ring-card');
    const setupCard = document.getElementById('goal-setup-card');
    if (s2.dailyGoal > 0) {
      if (ringCard) ringCard.style.display = 'flex';
      if (setupCard) setupCard.style.display = 'none';
      updateGoalRing();
    } else {
      if (ringCard) ringCard.style.display = 'none';
      if (setupCard) setupCard.style.display = 'block';
    }

    // today tasks
    renderTodayCard();
  }

  function renderTodayCard() {
    const day = State.getTodayTasks();
    const s = State.getAll();
    const days = ['So','Mo','Di','Mi','Do','Fr','Sa'];
    const today = days[new Date().getDay()];

    document.getElementById('today-day').textContent = today;
    document.getElementById('today-topic').textContent = day.name;

    const container = document.getElementById('today-tasks');
    container.innerHTML = day.tasks.map(task => renderTaskRow(task, s.done.includes(task.id))).join('');

    container.querySelectorAll('.task-row').forEach((row, i) => {
      row.addEventListener('click', (e) => {
        const task = day.tasks[i];
        State.toggleTask(task);
        const isDone = State.isTaskDone(task.id);
        const check = row.querySelector('.task-check');
        const txt = row.querySelector('.task-txt');
        if (isDone) {
          check.classList.add('done');
          txt.classList.add('done');
          const rect = row.getBoundingClientRect();
          xpPop(task.xp, rect.right - 60, rect.top);
          if (State.getAll().done.length % 5 === 0) confetti();
          updateGoalRing();
          // Woche abgeschlossen?
          const wi = State.getAll().currentWeek;
          if (State.getDoneCount(wi) === State.getTotalCount(wi)) {
            if (State.markWeekComplete(wi)) setTimeout(() => showMilestone(wi), 700);
          }
        } else {
          check.classList.remove('done');
          txt.classList.remove('done');
        }
        updateSidebar();
      });
    });
  }

  function renderTaskRow(task, isDone) {
    const typeMap = { theory:'Theorie', practice:'Praxis', reflect:'Reflektion', challenge:'Challenge' };
    return `
      <div class="task-row">
        <div class="task-check ${isDone ? 'done' : ''}"></div>
        <div class="task-body">
          <div class="task-txt ${isDone ? 'done' : ''}">${task.txt}</div>
          <div class="task-meta">
            <span class="task-badge b-${task.type}">${typeMap[task.type] || task.type}</span>
            <span class="task-time">${task.time}</span>
            <span class="task-xp">+${task.xp} XP</span>
          </div>
        </div>
      </div>`;
  }

  // ─── RENDER WEEKS ───
  let openDays = {};

  function renderWeeks() {
    const s = State.getAll();
    const tabs = document.getElementById('w-tabs');
    tabs.innerHTML = DATA.weeks.map((w, i) => {
      const dc = State.getDoneCount(i);
      const dt = State.getTotalCount(i);
      const done = dc === dt;
      return `<button class="wtab ${i === s.currentWeek ? 'active' : ''} ${done ? 'wdone' : ''}"
        onclick="UI.switchWeek(${i})">${w.title}</button>`;
    }).join('');

    renderWeekContent(s.currentWeek);
  }

  function renderWeekContent(wi) {
    const w = DATA.weeks[wi];
    const s = State.getAll();
    const dc = State.getDoneCount(wi);
    const dt = State.getTotalCount(wi);
    const pct = Math.round(dc / dt * 100);

    // hero
    const hero = document.getElementById('w-hero');
    hero.style.background = hexToRgba(w.color, 0.12);
    hero.style.border = `1px solid ${hexToRgba(w.color, 0.25)}`;
    hero.innerHTML = `
      <span class="week-hero-emoji">${w.emoji}</span>
      <div class="week-hero-title">${w.title} — ${w.subtitle}</div>
      <div class="week-hero-sub">Ziel dieser Woche</div>
      <div class="week-hero-goal">${w.goal}</div>
      <div class="week-prog">
        <div class="week-prog-bar"><div class="week-prog-fill" style="width:${pct}%"></div></div>
        <div class="week-prog-lbl">${dc} / ${dt} Aufgaben · ${pct}%</div>
      </div>`;

    // days
    const list = document.getElementById('w-days');
    list.innerHTML = w.days.map((day, di) => {
      const allDone = day.tasks.every(t => s.done.includes(t.id));
      const key = `${wi}-${di}`;
      const isOpen = openDays[key] !== false;
      return `
        <div class="day-card ${allDone ? 'all-done' : ''}" id="daycard-${wi}-${di}">
          <div class="day-card-header" onclick="UI.toggleDay(${wi},${di})">
            <span class="day-tag ${allDone ? 'done-tag' : ''}">${day.tag}${allDone ? ' ✓' : ''}</span>
            <span class="day-name">${day.name}</span>
            <span class="day-arrow ${isOpen ? 'open' : ''}">›</span>
          </div>
          <div class="day-tasks" style="${isOpen ? '' : 'display:none'}">
            ${day.tasks.map(task => renderTaskRow(task, s.done.includes(task.id))).join('')}
          </div>
        </div>`;
    }).join('');

    // attach task listeners
    w.days.forEach((day, di) => {
      day.tasks.forEach((task, ti) => {
        const rows = document.querySelectorAll(`#daycard-${wi}-${di} .task-row`);
        if (rows[ti]) {
          rows[ti].addEventListener('click', (e) => {
            State.toggleTask(task);
            const wasDone = State.isTaskDone(task.id);
            renderWeekContent(wi);
            updateSidebar();
            if (wasDone) {
              const rect = rows[ti].getBoundingClientRect();
              xpPop(task.xp, rect.right - 60, rect.top);
              updateGoalRing();
              if (State.getDoneCount(wi) === State.getTotalCount(wi)) {
                if (State.markWeekComplete(wi)) setTimeout(() => showMilestone(wi), 700);
              }
            }
          });
        }
      });
    });
  }

  function toggleDay(wi, di) {
    const key = `${wi}-${di}`;
    openDays[key] = !(openDays[key] !== false);
    const card = document.getElementById(`daycard-${wi}-${di}`);
    if (!card) return;
    const tasksEl = card.querySelector('.day-tasks');
    const arrow = card.querySelector('.day-arrow');
    if (openDays[key]) {
      tasksEl.style.display = 'block'; arrow.classList.add('open');
    } else {
      tasksEl.style.display = 'none'; arrow.classList.remove('open');
    }
  }

  function switchWeek(wi) {
    State.setCurrentWeek(wi);
    renderWeeks();
  }

  // ─── RENDER QUIZ ───
  function renderQuiz() {
    const s = State.getAll();
    document.getElementById('q-pts').textContent = s.quizPoints;
    document.getElementById('q-total').textContent = DATA.quiz.length;

    const wrap = document.getElementById('q-wrap');
    wrap.innerHTML = DATA.quiz.map((q, qi) => {
      const answered = s.quizAnswers[q.id];
      const hasAnswer = answered !== undefined;
      return `
        <div class="quiz-card">
          <div class="quiz-q-num">Frage ${qi + 1} / ${DATA.quiz.length}</div>
          <div class="quiz-q">${q.q}</div>
          <div class="quiz-opts">
            ${q.opts.map((opt, oi) => {
              let cls = '';
              if (hasAnswer) {
                if (oi === q.correct) cls = 'correct';
                else if (oi === answered) cls = 'wrong';
              }
              return `<button class="quiz-opt ${cls}" onclick="UI.answerQ('${q.id}',${oi},this)">${opt}</button>`;
            }).join('')}
          </div>
          ${hasAnswer ? `<div class="quiz-feedback ${answered === q.correct ? 'ok' : 'nok'}">${answered === q.correct ? '✓ Richtig! ' : '✗ Falsch. '}${q.exp}</div>` : ''}
        </div>`;
    }).join('');
  }

  function answerQ(qid, oi, btn) {
    const result = State.answerQuiz(qid, oi);
    if (!result) return;
    const card = btn.closest('.quiz-card');
    const q = DATA.quiz.find(q => q.id === qid);
    card.querySelectorAll('.quiz-opt').forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) b.classList.add('correct');
      else if (i === oi) b.classList.add('wrong');
    });
    const fb = document.createElement('div');
    fb.className = `quiz-feedback ${result.correct ? 'ok' : 'nok'}`;
    fb.textContent = (result.correct ? '✓ Richtig! ' : '✗ Falsch. ') + result.explanation;
    card.appendChild(fb);
    document.getElementById('q-pts').textContent = State.getAll().quizPoints;
    if (result.correct) {
      const rect = btn.getBoundingClientRect();
      xpPop(DATA.meta.xpPerQuiz, rect.right - 40, rect.top);
    }
    updateSidebar();
  }

  // ─── GOAL RING ───
  function updateGoalRing() {
    const s = State.getAll();
    if (!s.dailyGoal) return;
    const prog = State.getTodayProgress();
    const circumference = 214;
    const offset = circumference * (1 - prog.pct);
    const fg = document.getElementById('ring-fg');
    if (fg) { fg.style.strokeDashoffset = offset; fg.className = 'goal-ring-fg' + (prog.pct >= 1 ? ' done' : ''); }
    const xpEl = document.getElementById('ring-xp');
    if (xpEl) { xpEl.textContent = prog.xp; xpEl.className = 'goal-ring-xp' + (prog.pct >= 1 ? ' done' : ''); }
    const labels = { 15: '😌 Entspannt', 30: '🔥 Konsequent', 45: '⚡ Intensiv' };
    const titleEl = document.getElementById('ring-title');
    if (titleEl) titleEl.textContent = labels[s.dailyGoal] || 'Tagesziel';
    const subEl = document.getElementById('ring-sub');
    const doneEl = document.getElementById('ring-done');
    if (prog.pct >= 1) {
      if (subEl) subEl.style.display = 'none';
      if (doneEl) doneEl.style.display = 'block';
    } else {
      if (subEl) { subEl.style.display = ''; subEl.textContent = `${prog.xp} von ${s.dailyGoal} XP heute`; }
      if (doneEl) doneEl.style.display = 'none';
    }
  }

  // ─── STREAK KALENDER ───
  function renderStreakCal() {
    const wrap = document.getElementById('streak-cal-wrap');
    if (!wrap) return;
    const s = State.getAll();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const weekdays = ['Mo','Di','Mi','Do','Fr','Sa','So'];
    // Startpunkt: Montag der aktuellen Woche vor 4 Wochen (28 Tage)
    const cells = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const isToday = dateStr === todayStr;
      const hist = s.loginHistory.find(h => h.date === dateStr);
      const xp = isToday ? s.todayXP : (hist ? hist.xp : 0);
      let cls = 'cal-cell';
      if (xp > 0 && xp <= 15) cls += ' c1';
      else if (xp > 15 && xp <= 30) cls += ' c2';
      else if (xp > 30) cls += ' c3';
      if (isToday) cls += ' cal-today';
      cells.push(`<div class="${cls}" title="${xp} XP"></div>`);
    }
    wrap.innerHTML = `
      <div class="streak-cal-label">📅 28-Tage-Aktivität</div>
      <div class="cal-weekdays">${weekdays.map(d => `<div class="cal-wd">${d}</div>`).join('')}</div>
      <div class="cal-grid">${cells.join('')}</div>
      <div class="cal-legend">
        <span>Weniger</span>
        <div class="cal-legend-cell" style="background:var(--bg3);"></div>
        <div class="cal-legend-cell cal-cell c1"></div>
        <div class="cal-legend-cell cal-cell c2"></div>
        <div class="cal-legend-cell cal-cell c3"></div>
        <span>Mehr XP</span>
      </div>`;
  }

  // ─── MILESTONE MODAL ───
  function showMilestone(wi) {
    const w = DATA.weeks[wi];
    const s = State.getAll();
    const tasks = w.days.reduce((acc, d) => [...acc, ...d.tasks], []);
    const doneCount = tasks.filter(t => s.done.includes(t.id)).length;
    const weekXP = tasks.filter(t => s.done.includes(t.id)).reduce((sum, t) => sum + t.xp, 0);
    document.getElementById('ms-emoji').textContent = w.emoji;
    document.getElementById('ms-title').textContent = w.title + ' abgeschlossen!';
    document.getElementById('ms-sub').textContent = w.subtitle;
    document.getElementById('ms-xp').textContent = weekXP;
    document.getElementById('ms-tasks').textContent = doneCount + '/' + tasks.length;
    document.getElementById('ms-streak').textContent = s.streak;
    const nextWeek = DATA.weeks[wi + 1];
    const nextBtn = document.getElementById('ms-next-btn');
    if (nextBtn) {
      if (nextWeek) {
        document.getElementById('ms-next-num').textContent = wi + 2;
        nextBtn.style.display = '';
        nextBtn.onclick = () => { State.setCurrentWeek(wi + 1); closeMilestone(); App.navigate('weeks'); };
      } else {
        nextBtn.style.display = 'none';
      }
    }
    document.getElementById('milestone-modal').classList.add('show');
    confetti();
  }

  // ─── RENDER PROFILE ───
  function renderProfile() {
    const s = State.getAll();
    const lv = State.getLevel();
    document.getElementById('p-name').textContent = s.username;
    document.getElementById('p-level').textContent = `Level ${lv.level} · ${lv.title}`;
    document.getElementById('p-xp').textContent = `${s.xp} XP gesamt`;

    // shields section
    const shieldEl = document.getElementById('p-shields-count');
    if (shieldEl) shieldEl.textContent = s.shields;
    const shieldXP = document.getElementById('p-shields-xp');
    if (shieldXP) shieldXP.textContent = s.xp;
    const buyBtn = document.getElementById('p-shield-buy');
    if (buyBtn) {
      buyBtn.disabled = s.shields >= 3 || s.xp < 100;
      buyBtn.textContent = s.shields >= 3 ? '🛡️ Maximum (3/3)' : `🛡️ Streak-Schutz kaufen — 100 XP`;
    }

    renderStreakCal();
    const grid = document.getElementById('p-achievements');
    grid.innerHTML = DATA.achievements.map(ach => {
      const unlocked = s.achievements.includes(ach.id);
      return `
        <div class="ach-card ${unlocked ? 'unlocked' : ''}">
          <span class="ach-icon">${ach.icon}</span>
          <div class="ach-title">${ach.title}</div>
          <div class="ach-desc">${ach.desc}</div>
          <div class="ach-xp">+${ach.xp} XP</div>
        </div>`;
    }).join('');
  }

  // ─── SIDEBAR / XP UPDATE ───
  function updateSidebar() {
    const lv = State.getLevel();
    const headerXP = document.getElementById('h-xp-fill');
    if (headerXP) headerXP.style.width = Math.round(lv.progress * 100) + '%';
    const statXP = document.getElementById('h-stat-xp');
    if (statXP) statXP.textContent = State.getAll().xp;
  }

  // ─── HELPERS ───
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function showToast(msg, emoji = '🛡️') {
    const el = document.getElementById('achievement-toast');
    if (!el) return;
    el.querySelector('.ach-icon').textContent = emoji;
    el.querySelector('.ach-title').textContent = msg;
    el.querySelector('.ach-desc').textContent = '';
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 4000);
  }

  return { renderHome, renderWeeks, renderQuiz, renderProfile, switchWeek, toggleDay, answerQ, xpPop, confetti, showToast, showMilestone, updateGoalRing };
})();
