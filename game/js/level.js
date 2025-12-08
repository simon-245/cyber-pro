function goTo(url) {
  window.location.href = url;
}

// goes to next level, based on current
function goToNextLevel() {
    const currentPage = window.location.pathname;
    const match = currentPage.match(/level_(\d+)\.html/);
    
    if (match) {
      console.log("matched")
        const currentLevel = parseInt(match[1]);
      // max is 5
        if(currentLevel==5){
          alert("Good job, you completed all levels!")
        }
        const nextLevel = currentLevel + 1;
        window.location.href = `level_${nextLevel}.html`;
    } else {
      console.log("didnt match")
        // Fallback if pattern doesn't match
        window.location.href = 'level_2.html';
    }
}

// icons for scenarios, add more
const SCENARIO_ICONS = {
    wifi: '📡',
    phishing: '🎣',
    password: '🔑',
    social-media: '👤'
    default: '⚠️'
};

// run on startup, loads scenarios and prepares buttons
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('scenarios-container')) {
        loadLevel();
    }
    
    document.getElementById('submitBtn')?.addEventListener('click', checkAnswers);
    
    document.getElementById('nextLevelBtn')?.addEventListener('click', goToNextLevel);
});

let currentLevelData = null;

// load level data from json in script
function loadLevel() {
    try {
        const dataElement = document.getElementById('level-data');
        const jsonString = dataElement.textContent;
        const data = JSON.parse(jsonString);
        
        currentLevelData = data;
        renderLevel(data);
    } catch (error) {
        console.error('Could not load or parse level data:', error);
        document.getElementById('level-story').innerHTML = '⚠️ Error loading game data.';
    }
}

// renders level data into html
function renderLevel(data) {
  // render victim component
    const storyEl = document.getElementById('level-story');
    storyEl.innerHTML = `
        <div class="story-box">
            <span class="character-badge">👤 ${data.story.character_name}, Age ${data.story.age}</span>
            <p class="story-text">
                <strong>Background:</strong> ${data.story.background}<br>
                <strong>Mission:</strong> ${data.story.story}
            </p>
        </div>
    `;

    // render scenarios
    const container = document.getElementById('scenarios-container');
    container.innerHTML = '';

    // iterate scenarios
    data.scenarios.forEach((scenario, index) => {
        const scenarioCard = document.createElement('div');
        scenarioCard.className = 'scenario-card';
        scenarioCard.setAttribute('data-index', index);
        scenarioCard.setAttribute('data-safe', scenario.is_safe ? 'safe' : 'unsafe');
        
        //  handle click on card 
        scenarioCard.addEventListener('click', () => toggleSelection(scenarioCard));

        // get icon
        const icon = SCENARIO_ICONS[scenario.type] || SCENARIO_ICONS.default;

        // create scenario component
        scenarioCard.innerHTML = `
            <div class="card-header">
                <span class="scenario-icon">${icon}</span>
                <span class="scenario-type">${scenario.type.toUpperCase()}</span>
            </div>
            <div class="card-body">
                <h3 class="scenario-title">${scenario.title}</h3>
                ${scenario.description ? `<p class="scenario-description">${scenario.description}</p>` : ''}
            </div>
            <div class="card-footer">
                <span class="selection-indicator">
                    <span class="checkbox">☐</span> Click to select
                </span>
            </div>
        `;
        container.appendChild(scenarioCard);
    });
}

// togle card state
function toggleSelection(card) {
    if (!document.getElementById('submitBtn').disabled) {
        card.classList.toggle('selected');
        
        const checkbox = card.querySelector('.checkbox');
        if (card.classList.contains('selected')) {
            checkbox.textContent = '☑';
            card.style.transform = 'scale(1.02)';
            setTimeout(() => card.style.transform = '', 200);
        } else {
            checkbox.textContent = '☐';
        }
    }
}

// compare answer with solution
function checkAnswers() {
    if (!currentLevelData) return;

    const cards = document.querySelectorAll('.scenario-card');
    let correctPicks = 0;
    let incorrectPicks = 0;
    const totalScenarios = currentLevelData.scenarios.length;
    let totalUnsafe = currentLevelData.scenarios.filter(s => !s.is_safe).length;
    
    document.getElementById('submitBtn').disabled = true;

    cards.forEach(card => {
        const isSelected = card.classList.contains('selected');
        const isUnsafe = card.getAttribute('data-safe') === 'unsafe';
        const index = card.getAttribute('data-index');
        const scenario = currentLevelData.scenarios[index];

        // Remove card footer
        card.querySelector('.card-footer').style.display = 'none';

        // Create result badge
        const resultBadge = document.createElement('div');
        resultBadge.className = 'result-badge';

        if (isSelected && isUnsafe) {
            // Correct identification
            card.classList.add('result-correct');
            resultBadge.innerHTML = '✓ CORRECT';
            resultBadge.classList.add('badge-correct');
            correctPicks++;
        } else if (isSelected && !isUnsafe) {
            // False positive
            card.classList.add('result-wrong');
            resultBadge.innerHTML = '✗ FALSE ALARM';
            resultBadge.classList.add('badge-wrong');
            incorrectPicks++
        } else if (!isSelected && isUnsafe) {
            // Missed danger
            card.classList.add('result-missed');
            resultBadge.innerHTML = '! MISSED';
            resultBadge.classList.add('badge-missed');
            incorrectPicks++
        } else {
            // Correctly didn't select safe scenario
            card.classList.add('result-safe');
            resultBadge.innerHTML = '✓ SAFE';
            resultBadge.classList.add('badge-safe');
            correctPicks++;
        }

        // Add explanation
        const explanation = document.createElement('div');
        explanation.className = 'explanation-box';
        
        if (isUnsafe) {
            explanation.innerHTML = `
                <strong>⚠️ DANGER:</strong> ${scenario.explaination || 'This scenario poses a security risk.'}
            `;
        } else {
            explanation.innerHTML = `
                <strong>✓ SAFE:</strong> This scenario is generally secure.
            `;
        }

        // Remove old elements if they exist
        card.querySelector('.result-badge')?.remove();
        card.querySelector('.explanation-box')?.remove();

        // Add new elements
        card.querySelector('.card-header').appendChild(resultBadge);
        card.querySelector('.card-body').appendChild(explanation);

        // Add animation
        card.style.animation = 'revealResult 0.5s ease-out';
    });

    // Display Final Feedback with animation
    const feedbackEl = document.getElementById('result-feedback');
    const score = `${correctPicks} / ${totalScenarios}`;
    const percentage = correctPicks==0 ? 0 : Math.round((correctPicks / totalScenarios) * 100);

    if (score === 100) {
        feedbackEl.className = 'feedback correct';
        feedbackEl.innerHTML = `
            <div class="success-message">
                <div class="success-icon">🎉</div>
                <h3>Perfect Score!</h3>
                <p>You correctly identified all ${totalUnsafe} unsafe scenarios!</p>
                <div class="score-display">${percentage}%</div>
                <p class="success-subtext">Marta is now safe thanks to you!</p>
            </div>
        `;
        document.getElementById('nextLevelBtn').style.display = 'inline-block';
    } else {
        feedbackEl.className = 'feedback wrong';
        feedbackEl.innerHTML = `
            <div class="retry-message">
                <div class="retry-icon">🔍</div>
                <h3>Mission Incomplete</h3>
                <p>You correctly guessed ${score} scenarios</p>
                <div class="score-display">${percentage}%</div>
                <p class="retry-subtext">Review the cards and try again!</p>
            </div>
        `;
        document.getElementById('submitBtn').innerText = '🔄 Try Again';
        document.getElementById('submitBtn').disabled = false;
        document.getElementById('submitBtn').addEventListener('click', resetLevel, { once: true });
    }

    feedbackEl.style.animation = 'slideIn 0.5s ease-out';
}

// reset level for next attempt
function resetLevel() {
    const cards = document.querySelectorAll('.scenario-card');
    cards.forEach(card => {
        card.classList.remove('selected', 'result-correct', 'result-wrong', 'result-missed', 'result-safe');
        card.style.animation = '';
        card.querySelector('.result-badge')?.remove();
        card.querySelector('.explanation-box')?.remove();
        card.querySelector('.card-footer').style.display = 'block';
        card.querySelector('.checkbox').textContent = '☐';
    });
    
    document.getElementById('submitBtn').innerText = 'Submit Answer';
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('result-feedback').innerHTML = '';
    document.getElementById('result-feedback').style.animation = '';
}
