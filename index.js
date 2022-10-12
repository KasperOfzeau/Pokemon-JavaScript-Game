const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // Context canvas

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const img = new Image();
img.src = './images/PokemonStyleMap.png';
img.onload = () => {
    c.drawImage(img, -1400, -800)
}