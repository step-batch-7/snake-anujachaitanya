const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => colId + '_' + rowId;

const getCell = (colId, rowId) =>
  document.getElementById(getCellId(colId, rowId));

const createCell = function(grid, colId, rowId) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function() {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const eraseTail = function(snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.species);
};

const drawSnake = function(snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell && cell.classList.add(snake.species);
  });
};

const renderSnake = function(snake) {
  eraseTail(snake);
  drawSnake(snake);
};

const drawFood = function(food) {
  const [colId, rowId] = food.location;
  const foodCell = getCell(colId, rowId);
  foodCell.classList.add(food.type);
};

const eraseFood = function() {
  const previousFood =
    document.querySelector('.normal') || document.querySelector('.super');
  console.log(previousFood && previousFood.classList);
  previousFood && previousFood.classList.remove('normal', 'super');
};

const renderFood = function(food) {
  eraseFood();
  drawFood(food);
};

const showScore = function(score) {
  const scoreCard = document.getElementById('score');
  scoreCard.innerHTML = score;
};

const drawGame = function(game) {
  game.update();
  const { snake, ghostSnake, food, score } = game.getState();
  showScore(score);
  renderFood(food);
  renderSnake(snake);
  renderSnake(ghostSnake);
};

const handleKeyPress = (event, game) => {
  const keyMap = { 37: 'Left', 39: 'Right' };
  const turnCommand = keyMap[event.keyCode];
  if (turnCommand) game.turnSnake(turnCommand);
};

const attachEventListeners = game => {
  document.body.onkeydown = () => handleKeyPress(event, game);
};

const initSnake = () => {
  const snakePosition = [
    [40, 25],
    [41, 25],
    [42, 25]
  ];
  return new Snake(snakePosition, new Direction(EAST), 'snake');
};

const initGhostSnake = () => {
  const ghostSnakePosition = [
    [40, 30],
    [41, 30],
    [42, 30]
  ];
  return new Snake(ghostSnakePosition, new Direction(EAST), 'ghost');
};

const initGame = function(game) {
  createGrids();
  attachEventListeners(game);
  drawGame(game);
};

const createGame = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food([47, 30], 'normal');
  const game = new Game(snake, ghostSnake, food, [99, 59]);
  return game;
};

const main = function() {
  const game = createGame();
  initGame(game);

  const gamePlayer = setInterval(() => {
    drawGame(game);
    if (game.isDead()) {
      clearInterval(gamePlayer);
    }
  }, 100);

  setInterval(() => {
    game.moveGhostSnake();
  }, 600);
};
