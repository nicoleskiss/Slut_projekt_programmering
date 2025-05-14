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
  context.fillstyle = "black";
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
  const matrix = tetrominos[name];  // Hämta formmatris
  const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2); // Startposition kolumn
  const row = name === 'I' ? -1 : -2; // Startposition rad 
  return { name, matrix, row, col };
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
        if (tetromino.row + row < 0) {
			return showGameOver(); // Spelet slutar om en bit landar utanför toppen
		  }
        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name; 
      }
    }
  }
}
  