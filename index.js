const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // Context canvas

canvas.width = 1024;
canvas.height = 576;

// Map collisions
const collisionsMap = [];
for( let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70));
}

const boundaries = [];
const offset = {
    x: -740,
    y: -650
}

// Create boundaries
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025) {
            boundaries.push(
                new Boundary({
                    position: {
                        x:  j * Boundary.width + offset.x,
                        y:  i * Boundary.height + offset.y,
                    }
                }) 
            )
        }
    })
})

c.fillRect(0, 0, canvas.width, canvas.height);

// Background
const backgroundImg = new Image();
backgroundImg.src = './images/PokemonStyleMap.png';

// Foreground
const foregroundImg = new Image();
foregroundImg.src = './images/foreground.png';

// Player
const playerUpImage = new Image();
playerUpImage.src = './images/playerUp.png';

const playerDownImage = new Image();
playerDownImage.src = './images/playerDown.png';

const playerLeftImage = new Image();
playerLeftImage.src = './images/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './images/playerRight.png';

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage,
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: backgroundImg,
    frames: {
        max: 1
    }
});

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImg,
    frames: {
        max: 1
    }
});

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

const movables = [background, ...boundaries, foreground];

// Collision function
function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.width >= rectangle2.position.y
    )
}

function animate() {
    window.requestAnimationFrame(animate);
    background.draw();
    // Draw all boundaries
    boundaries.forEach(boundary => {
        boundary.draw();
    });

    player.draw();   
    foreground.draw();

    let moving = true;
    player.moving = false;
    if(keys.w.pressed && lastKey === 'w') {
        player.moving = true;
        player.image = player.sprites.up;

        for(let i = 0; i < boundaries.length; i++) {
            // Check collision
            const boundary = boundaries[i]; 
            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 2
                }}
            })) {
                moving = false;
                break;
            }
        }
        if(moving) {
            movables.forEach(movable => { 
                movable.position.y += 2;
            })
        }
    } else if(keys.a.pressed && lastKey === 'a'){
        player.moving = true;
        player.image = player.sprites.left;

        for(let i = 0; i < boundaries.length; i++) {
            // Check collision
            const boundary = boundaries[i]; 
            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x + 2,
                    y: boundary.position.y
                }}
            })) {
                moving = false;
                break;
            }
        }
        if(moving) {
            movables.forEach(movable => { 
                movable.position.x += 2;
            })
        }
    }
    else if(keys.s.pressed && lastKey === 's') {
        player.moving = true;
        player.image = player.sprites.down;

        for(let i = 0; i < boundaries.length; i++) {
            // Check collision
            const boundary = boundaries[i]; 
            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 15
                }}
            })) {
                moving = false;
                break;
            }
        }
        if(moving) {
            movables.forEach(movable => { 
                movable.position.y -= 2;
            })
        }
    }
    else if(keys.d.pressed && lastKey === 'd') {
        player.moving = true;
        player.image = player.sprites.right;

        for(let i = 0; i < boundaries.length; i++) {
            // Check collision
            const boundary = boundaries[i]; 
            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x -2,
                    y: boundary.position.y 
                }}
            })) {
                moving = false;
                break;
            }
        }
        if(moving) {
            movables.forEach(movable => { 
                movable.position.x -= 2;
            })
        }
    }
}

animate();

// Movement
let lastKey;
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w': 
            keys.w.pressed = true;
            lastKey = 'w';
        break
        case 'a': 
             keys.a.pressed = true;
             lastKey = 'a';
        break
        case 's': 
            keys.s.pressed = true;
            lastKey = 's';
        break
        case 'd': 
            keys.d.pressed = true;
            lastKey = 'd';
        break
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w': 
            keys.w.pressed = false;
        break
        case 'a': 
             keys.a.pressed = false;
        break
        case 's': 
            keys.s.pressed = false;
        break
        case 'd': 
            keys.d.pressed = false;
        break
    }
});