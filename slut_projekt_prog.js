function getRandomInt(min, max) {
    min = Math.ceil(min); 
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startLoading() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("loading").style.display = "block";
    let percent = 0;
    let interval = setInterval(() => {
      percent += 5;
      document.getElementById("loading-text").textContent = percent + "%";
      if (percent >= 100) {
        clearInterval(interval);
        document.getElementById("loading").style.display = "none";
        document.getElementById("game-container").style.display = "block";
        startGame();
      }
    }, 100);
  }

function drawBackground() {
    
}

