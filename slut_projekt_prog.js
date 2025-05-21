// Returnerar ett slumpmässigt heltal mellan min och max (inklusive båda)
function getRandomInt(min, max) {
	// avrundar uppåt för min, så att startvärdet är ett heltal
	min = Math.ceil(min);
	// avrundar nedåt för max, så att slutvärdet är ett heltal
	max = Math.floor(max);
	// returnerar ett slumpmässigt heltal i intervallet [min, max]
	return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  // Startar en laddningsanimation som successivt visar procent till 100%
  function startLoading() {
	// Dölj menyn
    document.getElementById("menu").style.display = "none";
	// Visa laddningsskärmen
    document.getElementById("loading").style.display = "block";
    let percent = 0;
	// Uppdatera laddningsprocent varje 100 ms
    let interval = setInterval(() => {
      percent += 5; // öka med 5 procentenheter per gång
      document.getElementById("loading-text").textContent = percent + "%";
      if (percent >= 100) {
		// När vi nått 100% stoppas intervallet
        clearInterval(interval);
		// Dölj laddningsskärmen
        document.getElementById("loading").style.display = "none";
		// Visa spelområdet
        document.getElementById("game-container").style.display = "block";
		// Starta spelet
        startGame();
      }
    }, 100);
  }

  // Fyller hela canvas med svart färg som bakgrund
  function drawBackground() {
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);
  }
  // Genererar en ny slumpmässig sekvens av tetrominos (alla 7 bitar i slumpmässig ordning)
  // Enligt Tetris "bag" random generator algoritm
  function generateSequence() {
	// Startsekvens med alla sju tetrominos
	const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
	// Så länge sekvensen inte är tom plockas en slumpmässig bit ut och läggs till tetrominoSequence
	while (sequence.length) {
	  const rand = getRandomInt(0, sequence.length - 1);
	  const name = sequence.splice(rand, 1)[0]; // ta bort och returnera biten på index rand
	  tetrominoSequence.push(name);
	}
  }
  
  // Hämtar nästa tetromino från sekvensen, genererar en ny om sekvensen är tom
  function getNextTetromino() {
	if (tetrominoSequence.length === 0) {
	  generateSequence();
	}
	// Plocka sista biten från sekvensen (pop)
	const name = tetrominoSequence.pop();
	// Hämta dess matrismönster (rotation)
	const matrix = tetrominos[name];
	// Beräkna startkolumn, I och O centrerade, övriga till vänster i mitten
	const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
	// I startar på rad -1 (nästan ovanför spelplan), övriga på rad -2 (ytterligare en rad ovanför)
	const row = name === 'I' ? -1 : -2;
	// Returnerar objekt med bitens namn, dess matris, samt startposition
	return {
	  name: name,      
	  matrix: matrix,  
	  row: row,        
	  col: col         
	};
  }
  
  // Roterar en NxN matris 90 grader medurs
  // Algoritm från CodeReview StackExchange
  function rotate(matrix) {
	const N = matrix.length - 1;
	const result = matrix.map((row, i) =>
	  row.map((val, j) => matrix[N - j][i])
	);
  
	return result;
  }
  // Kontrollerar om bitens matris på angiven rad och kolumn är en giltig position på spelplanen
  function isValidMove(matrix, cellRow, cellCol) {
	// Loopa genom bitens rader och kolumner
	for (let row = 0; row < matrix.length; row++) {
	  for (let col = 0; col < matrix[row].length; col++) {
		// Om det finns en block-del på den positionen i matrisen
		if (matrix[row][col] && (
		// Kolla om utanför spelplanens vänstra kant
			cellCol + col < 0 ||
			// Kolla om utanför spelplanens högra kant
			cellCol + col >= playfield[0].length ||
			// Kolla om under spelplanens botten
			cellRow + row >= playfield.length ||
			// Kolla om positionen redan är upptagen av annan bit
			playfield[cellRow + row][cellCol + col])
		  ) {
		  return false; // ogiltigt drag
		}
	  }
	}
  
	return true; // giltigt drag
  }
  
  // Placerar den aktiva tetrominon på spelplanen och kontrollerar om rader kan tas bort
  function placeTetromino() {
	// Loopa genom bitens matrismönster
	for (let row = 0; row < tetromino.matrix.length; row++) {
	  for (let col = 0; col < tetromino.matrix[row].length; col++) {
		if (tetromino.matrix[row][col]) {
  
		  // Om någon del av biten är ovanför spelplanen => game over
		  if (tetromino.row + row < 0) {
			return showGameOver();
		  }
		  // Placera biten i spelplanens 2D-array
		  playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
		}
	  }
	}
  
	// Kontrollera rader från botten och uppåt om de är helt fyllda
	for (let row = playfield.length - 1; row >= 0; ) {
	  if (playfield[row].every(cell => !!cell)) {
		// Ta bort raden genom att flytta ner alla rader ovanför
		for (let r = row; r >= 0; r--) {
		  for (let c = 0; c < playfield[r].length; c++) {
			playfield[r][c] = playfield[r-1][c];
		  }
		}
		// Efter borttagning, kolla samma rad igen eftersom rader har flyttats ner
	  }
	  else {
		row--; // annars gå upp till raden ovanför
	  }
	}
	// Hämta nästa tetromino för att fortsätta spelet
	tetromino = getNextTetromino();
  }
  
  // Visar "Game Over"-skärmen med halvtransparent bakgrund och text i mitten av canvas
  function showGameOver() {
	// Stoppa animationen
	cancelAnimationFrame(rAF);
	gameOver = true;
	// Rita en svart rektangel med transparens på mitten av canvas
	context.fillStyle = 'black';
	context.globalAlpha = 0.75;
	context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
	// Rita vit text "GAME OVER!" centrerat
	context.globalAlpha = 1;
	context.fillStyle = 'white';
	context.font = '36px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
  }
  // Hämtar canvas-elementet och dess 2D-ritkontext
  const canvas = document.getElementById('game');
  const context = canvas.getContext('2d');
  // Storlek på varje ruta i rutnätet i pixlar
  const grid = 32;
  // Array som håller ordningen på kommande tetrominos
  const tetrominoSequence = [];
  // Skapa en 2D-array för spelplanen (10 kolumner x 20 rader), med 2 extra rader ovanför för start
  const playfield = [];
  // Initiera spelplanen med 0 = tom ruta
  for (let row = -2; row < 20; row++) {
	playfield[row] = [];
	for (let col = 0; col < 10; col++) {
	  playfield[row][col] = 0;
	}
  }
  // Objekt som definierar formen på varje tetromino som en matris
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
  // Färgkod för varje tetromino-typ
  const colors = {
	'I': 'cyan',
	'O': 'yellow',
	'T': 'purple',
	'S': 'green',
	'Z': 'red',
	'J': 'blue',
	'L': 'orange'
  };

  let count = 0; // räknare för animation / tidsstyrd nedfärd av biten
  let tetromino = getNextTetromino(); // hämta första biten att spela med
  let rAF = null; // variabel för animation frame-id, för att kunna avbryta animationen
  let gameOver = false; // flagga som visar om spelet är slut
  
  // Spelets huvudloop som ritar om canvas och uppdaterar spelets tillstånd varje frame
  function loop() {
	// Begär att loop-funktionen anropas igen vid nästa frame
	rAF = requestAnimationFrame(loop);
	// Rensa hela canvas för ny bild
	context.clearRect(0,0,canvas.width,canvas.height);

	// Rita alla redan placerade block på spelplanen
	for (let row = 0; row < 20; row++) {
	  	for (let col = 0; col < 10; col++) {
			if (playfield[row][col]) {
		 	 	const name = playfield[row][col];
		  		context.fillStyle = colors[name];
				// Rita en ruta, 1 px mindre för att skapa ett rutnätsutseende
		  		context.fillRect(col * grid, row * grid, grid-1, grid-1);
			}
	  	}
	}
	// Rita den aktiva tetrominon som faller
	if (tetromino) {
	// Öka räknaren, och flytta ner biten var 35:e frame
	  if (++count > 35) {
		tetromino.row++;
		count = 0;
		// Om flyttningen nedåt är ogiltig, placera biten och hämta nästa
		if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
		  tetromino.row--;
		  placeTetromino();
		}
	  }
	  // Rita den aktiva tetrominon med rätt färg
	  context.fillStyle = colors[tetromino.name];
  
	  for (let row = 0; row < tetromino.matrix.length; row++) {
		for (let col = 0; col < tetromino.matrix[row].length; col++) {
		  if (tetromino.matrix[row][col]) {
  
			context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
		  }
		}
	  }
	}
  }
  // Lyssnar på tangenttryckningar för att flytta eller rotera tetrominon
  document.addEventListener('keydown', function(e) {
	if (gameOver) return; // inga kontroller om spelet är slut
	// Vänster och höger piltangenter flyttar biten
	if (e.which === 37 || e.which === 39) {
	  const col = e.which === 37
		? tetromino.col - 1 // vänster
		: tetromino.col + 1; // höger
	// Flytta bara om det är en giltig position
	  if (isValidMove(tetromino.matrix, tetromino.row, col)) {
		tetromino.col = col;
	  }
	}
	// Uppåtpil roterar biten 90 grader medurs
	if (e.which === 38) {
	  const matrix = rotate(tetromino.matrix);
	  if (isValidMove(matrix, tetromino.row, tetromino.col)) {
		tetromino.matrix = matrix;
	  }
	}
	// Nedåtpil flyttar biten snabbare nedåt (drop)
	if(e.which === 40) {
	  const row = tetromino.row + 1;
  
	  if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
		// Om nästa steg nedåt inte är giltigt, placera biten och avsluta funktionen
		tetromino.row = row - 1;
  
		placeTetromino();
		return;
	  }
	  // Om giltigt, flytta biten en rad nedåt
	  tetromino.row = row;
	}
  });
  // Starta spelets loop med requestAnimationFrame
  rAF = requestAnimationFrame(loop);