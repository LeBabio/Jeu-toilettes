const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');

let score = 0;
let lives = 3;

// Charger les images
const toiletImg = new Image();
toiletImg.src = 'toilet.png';  // Image de la toilette

const poopImg = new Image();
poopImg.src = 'poop.png';  // Image du caca

// Charger les sons
const proutSound = new Audio('prout.mp3');       // Son du prout
const ploufSound = new Audio('plouf.wav');       // Son du plouf dans les toilettes
const ecrasementSound = new Audio('ecrasement.mp3'); // Son du caca qui s’écrase

// Position de la toilette (plus grande)
const toilet = {
    x: canvas.width / 2 - 100,  // Centré sur le canevas
    y: canvas.height - 180,    // Un peu plus haut pour faire place à la taille
    width: 90,                // Largeur plus grande
    height: 225,               // Hauteur plus grande
    speed: 4,                  // Augmente un peu la vitesse de déplacement
    direction: 1 // 1 = vers la droite, -1 = vers la gauche
};

// Position du caca (plus grande)
const poop = {
    x: Math.random() * (canvas.width - 70), // Position initiale
    y: 0,
    width: 70,               // Largeur augmentée
    height: 70,              // Hauteur augmentée
    speed: 6,                // Vitesse de chute un peu plus rapide
    isFalling: false
};

// Dessine la toilette
function drawToilet() {
    ctx.drawImage(toiletImg, toilet.x, toilet.y, toilet.width, toilet.height);
}

// Dessine le caca
function drawPoop() {
    ctx.drawImage(poopImg, poop.x, poop.y, poop.width, poop.height);
}

// Gère la chute du caca
function updatePoop() {
    if (poop.isFalling) {
        poop.y += poop.speed;
        if (poop.y + poop.height > canvas.height) {
            if (poop.x + poop.width > toilet.x && poop.x < toilet.x + toilet.width) {
                // Le caca est tombé dans la toilette - jouer le son "plouf"
                ploufSound.play();
                score++;
                resetPoop();
            } else {
                // Le caca est tombé à côté - jouer le son "écrasement"
                ecrasementSound.play();
                lives--;
                resetPoop();
            }
        }
    }
}

// Réinitialise la position du caca
function resetPoop() {
    poop.x = Math.random() * (canvas.width - poop.width);
    poop.y = 0;
    poop.isFalling = false;
    scoreElement.textContent = score;
    livesElement.textContent = lives;

    if (lives <= 0) {
        alert('Game Over! Ton score est: ' + score);
        score = 0;
        lives = 3;
        scoreElement.textContent = score;
        livesElement.textContent = lives;
    }
}

// Déplace la toilette
function updateToilet() {
    toilet.x += toilet.direction * toilet.speed;
    if (toilet.x <= 0 || toilet.x + toilet.width >= canvas.width) {
        toilet.direction *= -1; // Changer de direction quand on touche un bord
    }
}

// Logique principale de mise à jour
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawToilet();
    drawPoop();
    updatePoop();
    updateToilet();
    requestAnimationFrame(updateGame);
}

// Événement de clic pour faire tomber le caca
canvas.addEventListener('click', () => {
    if (!poop.isFalling) {
        poop.isFalling = true;
        proutSound.play();  // Jouer le son de prout lorsque le caca commence à tomber
    }
});

// Démarre la boucle du jeu
updateGame();

