/* -------------------------------------------------
   js/quiz.js – Story-style quiz with XP, feedback, rank
   ------------------------------------------------- */

let quizState = { questions: [], current: 0, xp: 0, missionTitle: '', nextPage: '' };

function startQuiz(questions, missionTitle, nextPage) {
  quizState = { questions, current: 0, xp: 0, missionTitle, nextPage };
  renderQuestion();
}

function renderQuestion() {
  const q = quizState.questions[quizState.current];
  const total = quizState.questions.length;
  const prog = `${quizState.current + 1}/${total}`;

  document.getElementById('quizContainer').innerHTML = `
    <div class="quiz-card">
      <div class="quiz-header">
        <h3>${quizState.missionTitle}</h3>
        <small>Question ${prog} • XP: <span id="xpLive">${quizState.xp}</span></small>
      </div>
      <div class="quiz-question">${q.text}</div>
      <div class="quiz-answers">
        ${q.choices.map((c, i) => `
          <button class="answer-btn" data-i="${i}">${c.text}</button>
        `).join('')}
      </div>
      <p id="feedback" class="feedback"></p>
    </div>
  `;

  document.querySelectorAll('.answer-btn').forEach(btn => {
    btn.onclick = () => selectAnswer(parseInt(btn.dataset.i));
  });
}

function selectAnswer(choiceIndex) {
  const q = quizState.questions[quizState.current];
  const feedback = document.getElementById('feedback');
  const xpLive = document.getElementById('xpLive');

  // Disable buttons
  document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);

  const selected = q.choices[choiceIndex];
  const isCorrect = selected.next === q.correctNext;

  if (isCorrect) {
    const xpGain = selected.xpChange || 10;
    quizState.xp += xpGain;
    xpLive.textContent = quizState.xp;
    feedback.innerHTML = '<span class="correct">Correct! +XP</span>';
  } else {
    const xpLoss = selected.xpChange || -5;
    quizState.xp += xpLoss;
    xpLive.textContent = quizState.xp;
    feedback.innerHTML = `<span class="wrong">Wrong! ${xpLoss} XP</span>`;
  }

  setTimeout(() => {
    quizState.current++;
    if (quizState.current < quizState.questions.length) {
      renderQuestion();
    } else {
      showConclusion();
    }
  }, 1500);
}

function showConclusion() {
  const rank = quizState.xp >= 25 ? "Cyber Elite" : quizState.xp >= 15 ? "Cyber Guard" : "Trainee";
  const points = Math.max(0, quizState.xp);

  // Unlock next level
  const nextLevel = quizState.nextPage.replace('.html', '');
  if (window.CyberPro?.unlockLevel) {
    CyberPro.unlockLevel(nextLevel, points);
  }

  document.getElementById('quizContainer').innerHTML = `
    <div class="quiz-card result">
      <h3>Mission Complete!</h3>
      <p><strong>${quizState.missionTitle}</strong></p>
      <p>Final XP: <strong>${quizState.xp}</strong> → <strong>${rank}</strong></p>
      <button id="continueBtn" class="big-btn">Continue →</button>
      <button id="retryBtn" class="small-btn">Retry Mission</button>
    </div>
  `;

  document.getElementById('continueBtn').onclick = () => goTo(quizState.nextPage || 'levels.html');
  document.getElementById('retryBtn').onclick = () => {
    quizState.current = 0;
    quizState.xp = 0;
    renderQuestion();
  };
}

window.startQuiz = startQuiz;