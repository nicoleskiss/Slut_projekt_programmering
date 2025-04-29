function getRandomInt(min, max) {
    min = Math.ceil(min); 
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startLoading() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("loading").style.display = "block";
    let percent = 0;
    
}