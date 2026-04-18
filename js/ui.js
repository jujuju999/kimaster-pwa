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
    renderBlitzHomeCard();
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

  // ─── WISSENS-BLITZ ───
  let _blitzTimer = null;
  let _blitzSeconds = 60;
  let _blitzCurrentQ = 0;

  function renderBlitz() {
    const blitz = State.initBlitz();
    _blitzCurrentQ = Object.keys(blitz.answers).length;
    _blitzSeconds = 60;
    clearInterval(_blitzTimer);

    const wrap = document.getElementById('blitz-wrap');
    if (!wrap) return;

    if (blitz.completed) {
      _renderBlitzResult(blitz);
      return;
    }

    _renderBlitzQuestion(blitz);

    if (_blitzCurrentQ < 3) {
      _blitzTimer = setInterval(() => {
        _blitzSeconds--;
        const bar = document.getElementById('blitz-timer-bar');
        const num = document.getElementById('blitz-timer-num');
        if (bar) {
          bar.style.width = Math.max(0, (_blitzSeconds / 60) * 100) + '%';
          bar.style.background = _blitzSeconds <= 10 ? 'var(--red)' : 'var(--green)';
        }
        if (num) {
          num.textContent = _blitzSeconds;
          num.style.color = _blitzSeconds <= 10 ? 'var(--red)' : 'var(--green)';
        }
        if (_blitzSeconds <= 0) {
          clearInterval(_blitzTimer);
          _blitzTimeUp();
        }
      }, 1000);
    }
  }

  function _renderBlitzQuestion(blitz) {
    const wrap = document.getElementById('blitz-wrap');
    if (!wrap) return;
    const qi = _blitzCurrentQ;
    if (qi >= blitz.questions.length) {
      clearInterval(_blitzTimer);
      State.completeBlitz();
      _renderBlitzResult(State.getBlitz());
      return;
    }
    const q = blitz.questions[qi];
    const answered = blitz.answers[q.id];
    const hasAnswer = answered !== undefined;

    wrap.innerHTML = `
      <div class="blitz-timer-wrap">
        <div class="blitz-timer-track">
          <div class="blitz-timer-bar" id="blitz-timer-bar" style="width:${(_blitzSeconds/60)*100}%"></div>
        </div>
        <span class="blitz-timer-num" id="blitz-timer-num">${_blitzSeconds}</span>
      </div>
      <div class="blitz-progress">
        ${[0,1,2].map(i => `<div class="blitz-dot ${i < qi ? 'done' : i === qi ? 'active' : ''}"></div>`).join('')}
        <span style="font-size:12px;color:var(--text3);font-weight:700;margin-left:8px;">Frage ${qi+1} / 3</span>
      </div>
      <div class="quiz-card" style="margin:0;">
        <div class="quiz-q">${q.q}</div>
        <div class="quiz-opts" id="blitz-opts">
          ${q.opts.map((opt, oi) => {
            let cls = '';
            if (hasAnswer) {
              if (oi === q.correct) cls = 'correct';
              else if (oi === answered) cls = 'wrong';
            }
            return `<button class="quiz-opt ${cls}" ${hasAnswer ? 'disabled' : ''} onclick="UI.blitzAnswer('${q.id}',${oi},this)">${opt}</button>`;
          }).join('')}
        </div>
        ${hasAnswer ? `
          <div class="quiz-feedback ${answered === q.correct ? 'ok' : 'nok'}">
            ${answered === q.correct ? '✓ Richtig! ' : '✗ Falsch. '}${q.exp}
          </div>
          <button class="btn btn-green" style="margin-top:12px;" onclick="UI.blitzNext()">
            ${qi < 2 ? 'Weiter →' : 'Ergebnis sehen 🏁'}
          </button>` : ''}
      </div>`;
  }

  function blitzAnswer(qid, oi, btn) {
    const result = State.answerBlitz(qid, oi);
    if (!result) return;
    clearInterval(_blitzTimer);
    const blitz = State.getBlitz();
    _blitzCurrentQ = Object.keys(blitz.answers).length;
    _renderBlitzQuestion(blitz);
    if (result.correct && result.xpEarned > 0) {
      const rect = btn.getBoundingClientRect();
      xpPop(result.xpEarned, rect.right - 60, rect.top);
    }
    updateSidebar();
    // Restart timer for remaining questions
    if (_blitzCurrentQ < 3 && !blitz.completed) {
      _blitzTimer = setInterval(() => {
        _blitzSeconds--;
        const bar = document.getElementById('blitz-timer-bar');
        const num = document.getElementById('blitz-timer-num');
        if (bar) { bar.style.width = Math.max(0, (_blitzSeconds / 60) * 100) + '%'; bar.style.background = _blitzSeconds <= 10 ? 'var(--red)' : 'var(--green)'; }
        if (num) { num.textContent = _blitzSeconds; num.style.color = _blitzSeconds <= 10 ? 'var(--red)' : 'var(--green)'; }
        if (_blitzSeconds <= 0) { clearInterval(_blitzTimer); _blitzTimeUp(); }
      }, 1000);
    }
  }

  function blitzNext() {
    const blitz = State.getBlitz();
    _blitzCurrentQ = Object.keys(blitz.answers).length;
    if (_blitzCurrentQ >= 3) {
      clearInterval(_blitzTimer);
      State.completeBlitz();
      _renderBlitzResult(State.getBlitz());
      updateSidebar();
      renderHome();
    } else {
      _renderBlitzQuestion(blitz);
    }
  }

  function _blitzTimeUp() {
    State.completeBlitz();
    _renderBlitzResult(State.getBlitz());
    updateSidebar();
    renderHome();
  }

  function _renderBlitzResult(blitz) {
    clearInterval(_blitzTimer);
    const wrap = document.getElementById('blitz-wrap');
    if (!wrap) return;
    const medals = ['😢', '🌟', '🔥', '⚡'];
    const medal = medals[blitz.score];
    const bonus = blitz.score === 3 ? '+20 XP Bonus!' : '';
    wrap.innerHTML = `
      <div style="text-align:center;padding:32px 20px;">
        <div style="font-size:72px;margin-bottom:12px;">${medal}</div>
        <div style="font-size:24px;font-weight:900;color:var(--text);margin-bottom:6px;">
          ${blitz.score} / 3 richtig
        </div>
        <div style="font-size:14px;color:var(--text3);margin-bottom:4px;">
          ${blitz.score === 3 ? 'Perfekt! Alle Fragen richtig!' : blitz.score === 2 ? 'Sehr gut — fast perfekt!' : blitz.score === 1 ? 'Nicht schlecht, morgen wieder!' : 'Morgen läuft es besser!'}
        </div>
        ${bonus ? `<div style="font-size:13px;color:var(--green);font-weight:800;margin-bottom:4px;">${bonus}</div>` : ''}
        <div style="font-size:28px;font-weight:900;color:var(--green);margin:16px 0;">+${blitz.xp} XP</div>
        <div style="font-size:12px;color:var(--text3);margin-bottom:24px;">Neuer Blitz morgen früh 🌅</div>
        <button class="btn btn-green" onclick="App.navigate('home')" style="font-size:15px;">
          Zurück zum Home
        </button>
      </div>`;
  }

  function renderBlitzHomeCard() {
    const card = document.getElementById('blitz-home-card');
    if (!card) return;
    const blitz = State.getBlitz();
    const today = new Date().toISOString().split('T')[0];
    const s = State.getAll();
    const isToday = s.blitzDate === today;
    const done = isToday && blitz.completed;
    card.innerHTML = `
      <div class="blitz-home-inner ${done ? 'blitz-done' : ''}" onclick="${done ? '' : 'App.navigate(\'blitz\')'}" style="${done ? '' : 'cursor:pointer;'}">
        <div class="blitz-home-icon">${done ? '✅' : '⚡'}</div>
        <div class="blitz-home-body">
          <div class="blitz-home-title">${done ? 'Wissens-Blitz erledigt!' : 'Wissens-Blitz'}</div>
          <div class="blitz-home-sub">${done ? `${blitz.score}/3 richtig · +${blitz.xp} XP verdient` : '3 Fragen · 60 Sekunden · täglich neu'}</div>
        </div>
        ${done ? '' : '<div class="blitz-home-arrow">›</div>'}
      </div>`;
  }

  // ─── SHARE CARD ───
  function _rrect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function _buildCanvas() {
    const s = State.getAll();
    const lv = State.getLevel();
    const W = 1080, H = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    // ── Background ──
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#080f09');
    bg.addColorStop(1, '#0c1810');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Green glow top-right
    const g1 = ctx.createRadialGradient(W * 0.85, H * 0.15, 0, W * 0.85, H * 0.15, 380);
    g1.addColorStop(0, 'rgba(57,217,138,0.18)');
    g1.addColorStop(1, 'rgba(57,217,138,0)');
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

    // Orange glow bottom-left
    const g2 = ctx.createRadialGradient(W * 0.15, H * 0.85, 0, W * 0.15, H * 0.85, 280);
    g2.addColorStop(0, 'rgba(245,158,11,0.12)');
    g2.addColorStop(1, 'rgba(245,158,11,0)');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

    // ── Outer border ──
    ctx.strokeStyle = 'rgba(57,217,138,0.35)';
    ctx.lineWidth = 2;
    _rrect(ctx, 36, 36, W - 72, H - 72, 40);
    ctx.stroke();

    // ── Top badge ──
    ctx.fillStyle = 'rgba(57,217,138,0.12)';
    _rrect(ctx, 80, 80, 260, 56, 16);
    ctx.fill();
    ctx.fillStyle = '#39d98a';
    ctx.font = 'bold 28px "Nunito", "Arial", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🤖  KI MASTERY', 106, 116);

    // ── Name ──
    ctx.fillStyle = '#f8faf9';
    ctx.font = 'bold 88px "Nunito", "Arial Black", sans-serif';
    ctx.textAlign = 'left';
    // Clamp name to fit
    let name = s.username;
    while (ctx.measureText(name).width > W - 160 && name.length > 1) name = name.slice(0, -1) + '…';
    ctx.fillText(name, 80, 250);

    // ── Level pill ──
    const levelText = `Level ${lv.level}  ·  ${lv.title}`;
    ctx.font = '600 36px "Nunito", "Arial", sans-serif';
    const lw = ctx.measureText(levelText).width;
    ctx.fillStyle = 'rgba(57,217,138,0.15)';
    _rrect(ctx, 78, 268, lw + 32, 48, 12);
    ctx.fill();
    ctx.fillStyle = '#39d98a';
    ctx.fillText(levelText, 94, 302);

    // ── XP progress bar ──
    const barX = 80, barY = 345, barH = 14, barW = W - 160;
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    _rrect(ctx, barX, barY, barW, barH, 7);
    ctx.fill();
    const fillW = Math.max(0, Math.round(barW * lv.progress));
    if (fillW > 0) {
      const barGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
      barGrad.addColorStop(0, '#39d98a');
      barGrad.addColorStop(1, '#22c55e');
      ctx.fillStyle = barGrad;
      _rrect(ctx, barX, barY, fillW, barH, 7);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '600 26px "Nunito", "Arial", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${s.xp} XP`, barX, barY + 46);
    if (lv.next) {
      ctx.textAlign = 'right';
      ctx.fillText(`${lv.next.minXP} XP`, barX + barW, barY + 46);
    }

    // ── Divider ──
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(80, 430); ctx.lineTo(W - 80, 430); ctx.stroke();

    // ── Streak block (left half) ──
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.font = `bold ${s.streak >= 100 ? 130 : 160}px "Nunito", "Arial Black", sans-serif`;
    ctx.fillText(String(s.streak), 270, 620);
    ctx.font = '800 36px "Nunito", "Arial", sans-serif';
    ctx.fillStyle = 'rgba(245,158,11,0.9)';
    ctx.fillText('🔥 STREAK', 270, 680);
    ctx.font = '600 28px "Nunito", "Arial", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillText(`${s.streak === 1 ? 'Tag' : 'Tage'} in Folge`, 270, 720);

    // ── Vertical divider ──
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(540, 450); ctx.lineTo(540, 740); ctx.stroke();

    // ── Tasks block (right half) ──
    const totalDone = DATA.weeks.reduce((acc, w) =>
      acc + w.days.reduce((a2, d) => a2 + d.tasks.filter(t => s.done.includes(t.id)).length, 0), 0);
    const totalAll = DATA.weeks.reduce((acc, w) =>
      acc + w.days.reduce((a2, d) => a2 + d.tasks.length, 0), 0);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#a78bfa';
    ctx.font = `bold ${totalDone >= 100 ? 130 : 160}px "Nunito", "Arial Black", sans-serif`;
    ctx.fillText(String(totalDone), 810, 620);
    ctx.font = '800 36px "Nunito", "Arial", sans-serif';
    ctx.fillStyle = 'rgba(167,139,250,0.9)';
    ctx.fillText('✅ AUFGABEN', 810, 680);
    ctx.font = '600 28px "Nunito", "Arial", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillText(`von ${totalAll} erledigt`, 810, 720);

    // ── Divider ──
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(80, 755); ctx.lineTo(W - 80, 755); ctx.stroke();

    // ── Main tagline ──
    const daysActive = Math.min((s.loginHistory ? s.loginHistory.length : 0) + 1, 28);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f8faf9';
    ctx.font = 'bold 62px "Nunito", "Arial Black", sans-serif';
    ctx.fillText('Ich lerne KI mit Claude', W / 2, 845);

    // ── Day counter ──
    const dayGrad = ctx.createLinearGradient(W * 0.3, 0, W * 0.7, 0);
    dayGrad.addColorStop(0, '#39d98a');
    dayGrad.addColorStop(1, '#22c55e');
    ctx.fillStyle = dayGrad;
    ctx.font = 'bold 48px "Nunito", "Arial", sans-serif';
    ctx.fillText(`Tag ${daysActive} von 28`, W / 2, 910);

    // ── Bottom URL ──
    ctx.fillStyle = 'rgba(57,217,138,0.4)';
    ctx.font = '600 28px "Nunito", "Arial", sans-serif';
    ctx.fillText('jujuju999.github.io/kimaster-pwa', W / 2, 985);

    return canvas;
  }

  function shareProgress() {
    const btn = document.getElementById('share-btn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Generiere…'; }

    document.fonts.ready.then(() => {
      const canvas = _buildCanvas();
      canvas.toBlob(blob => {
        if (btn) { btn.disabled = false; btn.textContent = '📤 Fortschritt teilen'; }
        _showShareModal(canvas, blob);
      }, 'image/png');
    });
  }

  function _showShareModal(canvas, blob) {
    const existing = document.getElementById('share-modal');
    if (existing) existing.remove();

    const dataURL = canvas.toDataURL('image/png');
    const modal = document.createElement('div');
    modal.id = 'share-modal';
    modal.className = 'share-modal';
    modal.innerHTML = `
      <div class="share-modal-inner">
        <div class="share-modal-header">
          <span style="font-size:15px;font-weight:800;color:var(--text);">Deine Fortschritts-Karte</span>
          <button onclick="document.getElementById('share-modal').remove()" class="share-close">✕</button>
        </div>
        <img src="${dataURL}" class="share-preview" alt="Fortschritts-Karte">
        <div class="share-actions">
          <button class="btn btn-green" id="share-native-btn" style="flex:1;">
            📤 Teilen
          </button>
          <button class="btn" id="share-dl-btn" style="flex:1;">
            ⬇️ Speichern
          </button>
        </div>
        <div style="font-size:11px;color:var(--text3);text-align:center;padding:8px 0 0;">
          Halte das Bild gedrückt oder tippe Speichern um es in deine Galerie zu laden
        </div>
      </div>`;
    document.body.appendChild(modal);

    // Native share
    document.getElementById('share-native-btn').addEventListener('click', () => {
      const file = new File([blob], 'ki-mastery-fortschritt.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          title: 'KI Mastery — mein Fortschritt',
          text: `Ich lerne KI mit Claude! 🤖`,
          files: [file]
        }).catch(() => {});
      } else {
        _downloadBlob(blob);
      }
    });

    // Download fallback
    document.getElementById('share-dl-btn').addEventListener('click', () => _downloadBlob(blob));

    // Close on backdrop
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  }

  function _downloadBlob(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ki-mastery-fortschritt.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  return { renderHome, renderWeeks, renderQuiz, renderProfile, switchWeek, toggleDay, answerQ, xpPop, confetti, showToast, showMilestone, updateGoalRing, renderBlitz, blitzAnswer, blitzNext, renderBlitzHomeCard, shareProgress };
})();
