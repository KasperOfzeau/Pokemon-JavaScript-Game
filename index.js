const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // Context canvas

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

// Background
const img = new Image();
img.src = './images/PokemonStyleMap.png';

// Player
const playerImage = new Image();
playerImage.src = './images/playerDown.png';

// Load images
img.onload = () => {
    c.drawImage(img, -910, -600);
    c.drawImage(
        playerImage, 
        0, 
        0,
        playerImage.width / 4,
        playerImage.height,
        canvas.width / 2 - (playerImage.width / 4) / 2, 
        canvas.height / 2 - playerImage.height / 2,
        playerImage.width / 4,
        playerImage.height)
}
