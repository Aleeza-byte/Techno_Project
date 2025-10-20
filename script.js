const cells = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.board');
const scoreXSpan = document.getElementById('scoreX');
const scoreOSpan = document.getElementById('scoreO');
const restartButton = document.getElementById('restartButton');

const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const modalButton = document.getElementById('modal-button');

let xTurn = true;
let scoreX = 0;
let scoreO = 0;
let gameActive = true;
let lastWinner = null; // 👈 track who won the last round

const WINNING_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function startGame() {
  // 👇 Decide who starts: previous winner starts next round
  if (lastWinner === 'x') {
    xTurn = true;
  } else if (lastWinner === 'o') {
    xTurn = false;
  } else {
    // first ever round → X starts
    xTurn = true;
  }

  gameActive = true;
  cells.forEach(cell => {
    cell.classList.remove('x', 'o', 'winning-cell');
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
}

function handleClick(e) {
  if (!gameActive) return;
  const cell = e.target;
  const currentClass = xTurn ? 'x' : 'o';
  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    gameActive = false;
    updateScore(currentClass);
    highlightWin(currentClass);
    board.classList.add('shake');
    setTimeout(() => board.classList.remove('shake'), 500);
    setTimeout(() => showModal(`${currentClass.toUpperCase()} wins! 🎉`), 300);
  } else if (isDraw()) {
    gameActive = false;
    board.classList.add('shake');
    setTimeout(() => board.classList.remove('shake'), 500);
    setTimeout(() => showModal(`It's a draw!`), 300);
  } else {
    swapTurns();
  }
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass, 'animate-drop');

  // Reset animation after it plays so it can re-trigger next time
  cell.addEventListener('animationend', () => {
    cell.classList.remove('animate-drop');
  }, { once: true });
}

function swapTurns() {
  xTurn = !xTurn;
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => cells[index].classList.contains(currentClass));
  });
}

function highlightWin(currentClass) {
  WINNING_COMBINATIONS.forEach(combination => {
    if (combination.every(index => cells[index].classList.contains(currentClass))) {
      combination.forEach(index => cells[index].classList.add('winning-cell'));
    }
  });
}

function isDraw() {
  return [...cells].every(cell => {
    return cell.classList.contains('x') || cell.classList.contains('o');
  });
}

function updateScore(winner) {
  lastWinner = winner; // 👈 remember who won
  if (winner === 'x') {
    scoreX++;
    scoreXSpan.textContent = scoreX;
  } else {
    scoreO++;
    scoreOSpan.textContent = scoreO;
  }
}

function showModal(message) {
  modalMessage.textContent = message;
  modal.classList.remove('hidden');
}

modalButton.addEventListener('click', () => {
  modal.classList.add('hidden');
  startGame();
});

restartButton.addEventListener('click', () => {
  // 👇 restart resets *everything*, including last winner
  lastWinner = null;
  scoreX = 0;
  scoreO = 0;
  scoreXSpan.textContent = scoreX;
  scoreOSpan.textContent = scoreO;
  startGame();
});

// Start game on load
startGame();
