/* -------------------------------------------------
   js/game.js – Core navigation, progress & unlock
   ------------------------------------------------- */

const STORAGE_KEY = 'cyberProProgress';

function goTo(page) { window.location.href = page; }

function getProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { score: 0, unlocked: ['wifi'] };
}

function saveProgress(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

function getScore() { return getProgress().score; }

function addScore(points) {
  const p = getProgress();
  p.score += points;
  saveProgress(p);
  if (typeof updateLevelLocks === 'function') updateLevelLocks();
}

function unlockLevel(levelId, points = 0) {
  const p = getProgress();
  if (!p.unlocked.includes(levelId)) p.unlocked.push(levelId);
  if (points > 0) p.score += points;
  saveProgress(p);
  if (typeof updateLevelLocks === 'function') updateLevelLocks();
}

function initLevelsPage() {
  document.getElementById('backBtn')?.addEventListener('click', () => goTo('index.html'));
  document.querySelectorAll('#missionList button').forEach(btn => {
    const level = btn.dataset.level;
    btn.addEventListener('click', () => !btn.disabled && goTo(`${level}.html`));
  });
  updateLevelLocks();
}

function updateLevelLocks() {
  const p = getProgress();
  const scoreSpan = document.getElementById('scoreValue');
  if (scoreSpan) scoreSpan.textContent = p.score;

  document.querySelectorAll('#missionList button').forEach(btn => {
    const level = btn.dataset.level;
    const unlocked = p.unlocked.includes(level);
    btn.disabled = !unlocked;
    btn.classList.toggle('locked', !unlocked);
    if (!unlocked && !btn.querySelector('.lock')) {
      const lock = document.createElement('span');
      lock.textContent = ' [Locked]';
      lock.className = 'lock';
      btn.appendChild(lock);
    } else if (unlocked && btn.querySelector('.lock')) {
      btn.querySelector('.lock').remove();
    }
  });
}

function resetProgress() {
  if (confirm('Reset all progress?')) {
    localStorage.removeItem(STORAGE_KEY);
    alert('Progress reset!');
    location.reload();
  }
}

window.CyberPro = { goTo, getScore, addScore, unlockLevel, getProgress, resetProgress, initLevelsPage, updateLevelLocks };

if (document.getElementById('missionList')) {
  document.addEventListener('DOMContentLoaded', initLevelsPage);
}