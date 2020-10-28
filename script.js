// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0
let playerGuessArray = []
let equationsArray = [];
let bestScoreArray = []

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];


// Time
let timer;
let timePlayed = 0
let baseTime = 0
let penaltyTime = 0
let finalTime = 0
let finalTimeDisplay = '0.0'

// Scroll
let valueY = 0

// reset splashPage best Score
function bestScoresToDOM () {
  bestScores.forEach((bestScore, i) => {
    const bestScoreEL = bestScore;
    bestScoreEL.textContent = `${bestScoreArray[i].bestScore}`
    console.log(bestScoreEL)
  })
}

// best score from localstorage
function getSavedBestScores () {
if (localStorage.getItem('bestScores')) {
  bestScoreArray = JSON.parse(localStorage.bestScores)
  }else {
    bestScoreArray = [
      {questions: 10, bestScore: finalTimeDisplay},
      {questions: 25, bestScore: finalTimeDisplay},
      {questions: 50, bestScore: finalTimeDisplay},
      {questions: 99, bestScore: finalTimeDisplay}
    ]
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
  }
  bestScoresToDOM()
}
// update best score array
function updateBestScore () {
  bestScoreArray.forEach((score, i) => {
    // select correct best score
    if (questionAmount == score.questions) {
      const savedBestScore = Number(bestScoreArray[i].bestScore)
      // update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[i].bestScore = finalTimeDisplay
      }
    }
  })
  bestScoresToDOM()
  // save to local storage again
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
}

// reset game
function playAgain () {
  gamePage.addEventListener('click', startTimer)
  scorePage.hidden = true
  splashPage.hidden = false
  equationsArray = []
  playerGuessArray = []
  valueY = 0
  playAgainBtn.hidden = true
}

function showScorePage () {
  // show play again button after 1s
  setTimeout (() => {
    playAgainBtn.hidden = false
  }, 1000)
  gamePage.hidden = true
  scorePage.hidden = false

}
// Format and Display time in DOM
function scoreToDOM () {
  finalTimeDisplay = finalTime.toFixed(1)
  baseTime = timePlayed.toFixed(1)
  penaltyTime = penaltyTime.toFixed(1)
  baseTimeEl.textContent = `Base Time: ${baseTime}s`
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`
  finalTimeEl.textContent = `${finalTimeDisplay}s`
  updateBestScore()
  // scroll to top
  itemContainer.scrollTo({ top: 0, behavior: 'smooth'})
  showScorePage()
}

// Stop Timer, process results and go to score page
function checkTime () {
  if (playerGuessArray.length == questionAmount) {
    clearInterval(timer)
    // check for wrong equations and add penalty time
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // correct guess, no penalty
      }else {
        // incorrect guess, add penalty time
        penaltyTime +=0.5
      }
    })
    finalTime = timePlayed + penaltyTime
    scoreToDOM()
  }
}

// Add 1/10 of a sec to the timePlayed
function addTime () {
  timePlayed += 0.1
  checkTime()
}

// start timer
function startTimer () {
  // reset the times
 timePlayed = 0
 penaltyTime = 0
 finalTime = 0
 timer = setInterval (addTime, 100);
 gamePage.removeEventListener('click', startTimer)
}
// scroll and store user selection in playerGUESSARRAY
function select (guessTrue) {
  console.log('player guessed array:', playerGuessArray)
// 80px scroll
valueY +=80;
itemContainer.scroll(0, valueY)
// add player guess to array
return guessTrue ? playerGuessArray.push('true') : playerGuessArray.push('false')
}

// display game page
function showGamePage () {
  gamePage.hidden = false
  countdownPage.hidden = true
}

// GET RANDOM VALUE UP TO MAX VALUE
function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt (questionAmount)
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt (9)
    secondNumber = getRandomInt (9)
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt (9)
    secondNumber = getRandomInt (9)
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt (3)
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle (equationsArray)
}

function equationUpdate() {
  equationsArray.forEach((equation) => {
    // item
    const item = document.createElement('div')
    item.classList.add('item')
    // Eqn Text
    eqnText = document.createElement('h1')
    eqnText.textContent = equation.value
    // append
    item.appendChild(eqnText)
    itemContainer.appendChild(item)
  })
}


// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations()
  equationUpdate()

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}
// countdown from 3
function countDown () {
  countdown.innerText = "3";
  let maxTime = 3; 
  const start = setInterval ( function down () {
    if (maxTime === 1) {
      countdown.innerText = "GO!";
      clearInterval(start);
    }else {
      maxTime --
      countdown.innerText = maxTime
      }
    }, 1000)
}
// splash to countdown page
function showCountdown () {
  countdownPage.hidden = false
  splashPage.hidden = true
  countDown()
  populateGamePage()
  setTimeout(showGamePage, 4000)
}

// get value from radio button
function getRadioValue () {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value
    }
  })
  return radioValue
}
// amount of question
function selectQustionAmount (e) {
  e.preventDefault();
  questionAmount = getRadioValue()
  console.log('question amount:', questionAmount)
  if (questionAmount) {
    showCountdown()
  }
}

startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // remove selected label
    radioEl.classList.remove('selected-label')
    // add selected label
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label')
    }
  })
})
// Event listners
startForm.addEventListener('submit', selectQustionAmount)
gamePage.addEventListener('click', startTimer)

// on Load
getSavedBestScores()