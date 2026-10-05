const ROUND_SECONDS = 60;
const BUBBLE_COUNT = 40;
const POINTS_PER_HIT = 10;
const BEST_SCORE_KEY = "bubbly-number-hunt-best";

const targetNumber = document.querySelector("#target-number");
const timerValue = document.querySelector("#timer-value");
const scoreValue = document.querySelector("#score-value");
const bestValue = document.querySelector("#best-value");
const gameMessage = document.querySelector("#game-message");
const welcomePanel = document.querySelector("#welcome-panel");
const bubbleGrid = document.querySelector("#bubble-grid");
const resultPanel = document.querySelector("#result-panel");
const resultTitle = document.querySelector("#result-title");
const finalScore = document.querySelector("#final-score");
const startButton = document.querySelector("#start-button");
const replayButton = document.querySelector("#replay-button");

let score = 0;
let timeLeft = ROUND_SECONDS;
let target = null;
let bestScore = loadBestScore();
let timerId = null;
let isPlaying = false;

bestValue.textContent = String(bestScore);

function randomNumber(max) {
  return Math.floor(Math.random() * max) + 1;
}

function renderBubbles() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < BUBBLE_COUNT; index += 1) {
    const number = randomNumber(9);
    const bubble = document.createElement("button");

    bubble.className = "bubble";
    bubble.type = "button";
    bubble.dataset.number = String(number);
    bubble.textContent = String(number);
    bubble.setAttribute("aria-label", `Bubble ${number}`);
    fragment.append(bubble);
  }

  bubbleGrid.replaceChildren(fragment);
}

function updateTarget() {
  target = randomNumber(9);
  targetNumber.textContent = String(target);
}

function updateScore() {
  scoreValue.textContent = String(score);

  if (score > bestScore) {
    bestScore = score;
    bestValue.textContent = String(bestScore);
    saveBestScore(bestScore);
  }
}

function startRound() {
  window.clearInterval(timerId);
  score = 0;
  timeLeft = ROUND_SECONDS;
  isPlaying = true;

  scoreValue.textContent = "0";
  timerValue.textContent = String(timeLeft);
  timerValue.classList.remove("is-low");
  gameMessage.textContent = "Find the bubble with the target number.";
  welcomePanel.hidden = true;
  resultPanel.hidden = true;
  bubbleGrid.hidden = false;

  updateTarget();
  renderBubbles();
  timerId = window.setInterval(tick, 1000);
}

function tick() {
  timeLeft -= 1;
  timerValue.textContent = String(timeLeft);

  if (timeLeft <= 10) {
    timerValue.classList.add("is-low");
  }

  if (timeLeft <= 0) {
    finishRound();
  }
}

function finishRound() {
  window.clearInterval(timerId);
  isPlaying = false;
  bubbleGrid.hidden = true;
  resultPanel.hidden = false;
  finalScore.textContent = String(score);

  if (score === 0) {
    resultTitle.textContent = "Every round is a start.";
    gameMessage.textContent = "Time is up. Ready for another try?";
  } else if (score >= 300) {
    resultTitle.textContent = "Incredible focus!";
    gameMessage.textContent = "Time is up. That was a brilliant round.";
  } else {
    resultTitle.textContent = "Nice focus!";
    gameMessage.textContent = "Time is up. Fancy another round?";
  }
}

bubbleGrid.addEventListener("click", (event) => {
  const bubble = event.target.closest("button[data-number]");

  if (!bubble || !isPlaying) {
    return;
  }

  const chosenNumber = Number(bubble.dataset.number);

  if (chosenNumber !== target) {
    gameMessage.textContent = `That was ${chosenNumber}. Find ${target} to score.`;
    return;
  }

  score += POINTS_PER_HIT;
  updateScore();
  updateTarget();
  renderBubbles();
  gameMessage.textContent = `Nice! +${POINTS_PER_HIT}. Find ${target} next.`;

  // Keep keyboard players in the bubble grid after a correct answer rebuilds it.
  if (event.detail === 0) {
    bubbleGrid.querySelector(".bubble")?.focus();
  }
});

startButton.addEventListener("click", startRound);
replayButton.addEventListener("click", startRound);

function loadBestScore() {
  try {
    return Number(window.localStorage.getItem(BEST_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBestScore(value) {
  try {
    window.localStorage.setItem(BEST_SCORE_KEY, String(value));
  } catch {
    // The game remains playable when browser storage is unavailable.
  }
}
