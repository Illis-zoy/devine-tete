const words = [
  "Pizza",
  "Lion",
  "Harry Potter",
  "Banane",
  "Football",
  "Tour Eiffel",
  "Chat",
  "TikTok",
  "Chocolat",
  "Plage",
  "Ski",
  "Licorne",
  "Minecraft",
  "Docteur",
  "Avion"
];

let score = 0;
let timeLeft = 60;
let timer = null;
let currentWord = "";

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const startButton = document.getElementById("start-button");
const passButton = document.getElementById("pass-button");
const correctButton = document.getElementById("correct-button");
const restartButton = document.getElementById("restart-button");

const wordElement = document.getElementById("word");
const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const finalScoreElement = document.getElementById("final-score");

function showScreen(screen) {
  startScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  endScreen.classList.remove("active");

  screen.classList.add("active");
}

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

function showNewWord() {
  currentWord = getRandomWord();
  wordElement.textContent = currentWord;
}

function startGame() {
  score = 0;
  timeLeft = 60;

  scoreElement.textContent = score;
  timeElement.textContent = timeLeft;

  showScreen(gameScreen);
  showNewWord();

  timer = setInterval(() => {
    timeLeft = timeLeft - 1;
    timeElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function correctAnswer() {
  score = score + 1;
  scoreElement.textContent = score;
  showNewWord();
}

function passWord() {
  showNewWord();
}

function endGame() {
  clearInterval(timer);
  finalScoreElement.textContent = score;
  showScreen(endScreen);
}

startButton.addEventListener("click", startGame);
correctButton.addEventListener("click", correctAnswer);
passButton.addEventListener("click", passWord);
restartButton.addEventListener("click", startGame);