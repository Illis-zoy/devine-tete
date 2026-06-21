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

let motionEnabled = false;
let gameIsRunning = false;
let lastTiltActionTime = 0;

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const startButton = document.getElementById("start-button");
const passButton = document.getElementById("pass-button");
const correctButton = document.getElementById("correct-button");
const restartButton = document.getElementById("restart-button");
const motionButton = document.getElementById("motion-button");
const motionStatus = document.getElementById("motion-status");

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
  gameIsRunning = true;

  scoreElement.textContent = score;
  timeElement.textContent = timeLeft;

  showScreen(gameScreen);
  showNewWord();

  clearInterval(timer);

  timer = setInterval(() => {
    timeLeft = timeLeft - 1;
    timeElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function correctAnswer() {
  if (!gameIsRunning) return;

  score = score + 1;
  scoreElement.textContent = score;
  showNewWord();
}

function passWord() {
  if (!gameIsRunning) return;

  showNewWord();
}

function endGame() {
  clearInterval(timer);
  gameIsRunning = false;
  finalScoreElement.textContent = score;
  showScreen(endScreen);
}

async function requestMotionPermission() {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();

      if (permission === "granted") {
        enableMotion();
      } else {
        motionStatus.textContent = "Permission refusée";
      }
    } catch (error) {
      motionStatus.textContent = "Erreur avec les capteurs";
    }
  } else {
    enableMotion();
  }
}

function enableMotion() {
  motionEnabled = true;
  motionStatus.textContent = "Inclinaison activée";

  window.addEventListener("deviceorientation", handleOrientation);
}

function handleOrientation(event) {
  if (!motionEnabled || !gameIsRunning) return;

  const beta = event.beta;
  const gamma = event.gamma;

  if (beta === null || gamma === null) return;

  const now = Date.now();

  // Évite qu’un seul mouvement compte plusieurs fois
  if (now - lastTiltActionTime < 1000) {
    return;
  }

  /*
    Tes valeurs mesurées :
    Neutre   : beta ≈ -3    gamma ≈ -86
    Correct  : beta ≈ -178  gamma ≈ 21
    Passer   : beta ≈ 0     gamma ≈ -22
  */

  const isCorrectTilt = beta < -120;
  const isPassTilt = gamma > -50 && beta > -60 && beta < 60;

  if (isCorrectTilt) {
    correctAnswer();
    lastTiltActionTime = now;
  } else if (isPassTilt) {
    passWord();
    lastTiltActionTime = now;
  }
}

motionButton.addEventListener("click", requestMotionPermission);
startButton.addEventListener("click", startGame);
correctButton.addEventListener("click", correctAnswer);
passButton.addEventListener("click", passWord);
restartButton.addEventListener("click", startGame);