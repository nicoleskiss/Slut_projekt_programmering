// Returnerar ett slumpmässigt heltal mellan min och max (inklusive båda).
function getRandomInt(min, max) {
    min = Math.ceil(min); // Avrundar uppåt till närmaste heltal
    max = Math.floor(max); // Avrundar nedåt till närmaste heltal
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Visar en laddningsskärm innan spelet startar.
function startLoading() {
    document.getElementById("menu").style.display = "none"; // Dölj meny
    document.getElementById("loading").style.display = "block"; // Visa laddningsskärm
    let percent = 0;

     // Ökar laddningsprocenten var 100 ms tills den når 100 %
    let interval = setInterval(() => {
      percent += 5;
      document.getElementById("loading-text").textContent = percent + "%";

       // När 100 % är uppnått, starta spelet
      if (percent >= 100) {
        clearInterval(interval);
        document.getElementById("loading").style.display = "none";
        document.getElementById("game-container").style.display = "block";
        startGame();
      }
    }, 100);
  }

// Ritar en svart bakgrund på canvasen
function drawBackground() {
  context.fillStyle = "black";
  context.fillRect(0,0, canvas.width, canvas.height); 
}

// Skapar en slumpmässig sekvens av alla 7 tetromino-typer, dvs. block (I, J, L, O, S, T, Z)
function generateSequence() {
  const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  while (sequence.length) {
    const rand = getRandomInt(0, sequence.length - 1);
	  const name = sequence.splice(rand, 1)[0]; // Ta bort och returnera slumpmässigt element
	  tetrominoSequence.push(name); // Lägg till i spel-sekvens
  }
}

// Returnerar nästa tetromino från sekvensen, genererar ny om sekvensen är slut
function getNextTetromino() {
  if (tetrominoSequence.length === 0) {
    generateSequence();
  }
  const name = tetrominoSequence.pop(); // Plocka nästa tetromino
  const matrix = tetromino[name];  // Hämta formmatris
  const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2); // Startposition kolumn
  const row = name === 'I' ? -1 : -2; // Startposition rad 
  return { 
	name: name, 
	matrix: matrix, 
	row: row,
	col: col
	};
}

// Roterar blocket medurs
function rotate(matrix) {
	const N = matrix.length - 1;
	const result = matrix.map((row, i) =>
	  row.map((val, j) => matrix[N - j][i])
	);
  
	return result;
  }

// Kontrollerar om en rörelse är giltig
function isValidMove(matrix, cellRow, cellCol) {
	for (let row = 0; row < matrix.length; row++) {
	  for (let col = 0; col < matrix[row].length; col++) {
		if (matrix[row][col] && (
			cellCol + col < 0 ||
			cellCol + col >= playfield[0].length ||
			cellRow + row >= playfield.length ||
			playfield[cellRow + row][cellCol + col])
		  ) {
		  return false;
		}
	  }
	}
  
	return true;
  }

// Placerar aktuell tetromino på spelplanen
function placeTetromino() {
	for (let row = 0; row < tetromino.matrix.length; row++) {
	  for (let col = 0; col < tetromino.matrix[row].length; col++) {
		if (tetromino.matrix[row][col]) {
  
		  // 
		  if (tetromino.row + row < 0) {
			return showGameOver(); // Spelet slutar om en bit landar utanför toppen	
		  }
  
		  playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
		}
	  }
	}

// Kontrollera om någon rad är full
    for (let row = playfield.length - 1; row >= 0; ) {
	  if (playfield[row].every(cell => !!cell)) {
		for (let r = row; r >= 0; r--) {
		  for (let c = 0; c < playfield[r].length; c++) {
			playfield[r][c] = playfield[r-1][c]; // Flytta rader neråt
		  }
		}
	  }
	  else {
		row--;
	  }
	}
  
	tetromino = getNextTetromino(); // Starta ny bit
}

// Visar Game Over-meddelande och stoppar animationen
function showGameOver() {
	cancelAnimationFrame(rAF);
	gameOver = true;
  
	context.fillStyle = 'black';
	context.globalAlpha = 0.75;
	context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
  
	context.globalAlpha = 1;
	context.fillStyle = 'white';
	context.font = '36px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
  }
  
  // Initierar canvas och spelplan
  const canvas = document.getElementById('game');
  const context = canvas.getContext('2d');
  const grid = 32;
  const tetrominoSequence = [];
  // Skapar 22 rader (varav 2 är "osynliga" överst)
  const playfield = [];
  for (let row = -2; row < 20; row++) {
	playfield[row] = [];
  
	for (let col = 0; col < 10; col++) {
	  playfield[row][col] = 0; // 0 betyder tom ruta
	  }
  }

// Formerna för varje tetromino, i form av matriser källa:(https://tetris.fandom.com/wiki/SRS)
const tetrominos = {
  	'I': [
	  [0,0,0,0],
	  [1,1,1,1],
	  [0,0,0,0],
	  [0,0,0,0]
	],
	'J': [
	  [1,0,0],
	  [1,1,1],
	  [0,0,0],
	],
	'L': [
	  [0,0,1],
	  [1,1,1],
	  [0,0,0],
	],
	'O': [
	  [1,1],
	  [1,1],
	],
	'S': [
	  [0,1,1],
	  [1,1,0],
	  [0,0,0],
	],
	'Z': [
	  [1,1,0],
	  [0,1,1],
	  [0,0,0],
	],
	'T': [
	  [0,1,0],
	  [1,1,1],
	  [0,0,0],
	]
  };

// Färger för varje tetromino
  const colors = {
	'I': 'cyan',
	'O': 'yellow',
	'T': 'purple',
	'S': 'green',
	'Z': 'red',
	'J': 'blue',
	'L': 'orange'
};

let count = 0;
  let tetromino = getNextTetromino();
  let rAF = null;  
  let gameOver = false;

  // Huvudloop som uppdaterar canvasen och hanterar fallande bitar
  function loop() {
	rAF = requestAnimationFrame(loop);
	context.clearRect(0, 0, canvas.width, canvas.height); // Rensa canvas

	// Rita placerade block
	for (let row = 0; row < 20; row++) {
		for (let col = 0; col < 10; col++) {
			if (playfield[row][col]) {
				const name = playfield[row][col];
				context.fillStyle = colors[name];
				context.fillRect(col * grid, row * grid, grid-1, grid-1);
			}
		}
	}
  

  	if (tetromino) {
		if (++count > 35) { // Justera hastighet
	  	tetromino.row++;
	  	count = 0;

	  	if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)){
			tetromino.row--;
			placeTetromino();
	 	 }
 	 }

 	 context.fillStyle = colors[tetromino.name];

  		for (let row = 0; row < tetromino.matrix.length; row++){
		  for (let col = 0; col < tetromino.matrix[row].length; col++){
			if (tetromino.matrix[row][col]){
					context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);

			}
	  	  }
	    }
      }
    }

	document.addEventListener('keydown', function(e) {
		if (gameOver) return;

		if (e.which === 37 || e.which === 39) {
		   const col = e.which === 37
		   ? tetromino.col - 1
		   : tetromino.col + 1;

		 if (isValidMove(tetromino.matrix, tetromino.row, col)){
			tetromino.col = col;
		 }
	}

	
)

// Hanterar tangenttryckningar för att styra bitarna