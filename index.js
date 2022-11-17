const startButton = document.getElementById('start');
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // Context canvas

const overworldMusic = document.createElement('audio');
overworldMusic.setAttribute('src', './audio/1-23 - Jubilife City (Day).mp3');
overworldMusic.loop = true;

startButton.addEventListener("click", () => {
    startButton.remove();
    animateBattle();
    overworldMusic.play();
});

canvas.width = 1024;
canvas.height = 576;

// Map collisions
const collisionsMap = [];
for( let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70));
}

// Map battle zones
const battleZonesMap = [];
for( let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, i + 70));
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

const battleZones = [];

// Create battle zones
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025) {
            battleZones.push(
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
        max: 4,
        hold: 20
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

const movables = [background, ...boundaries, foreground, ...battleZones];

// Collision function
function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.width >= rectangle2.position.y
    )
}

const battle = {
    initiated: false
}

const battleMusic = document.createElement('audio');
battleMusic.setAttribute('src', './audio/1-10 - Battle! (Wild Pokémon).mp3');
battleMusic.loop = true;

// Animation loop
function animate() {
    const animationId = window.requestAnimationFrame(animate);
    background.draw();
    // Draw all boundaries
    boundaries.forEach(boundary => {
        boundary.draw();
    });
    battleZones.forEach(battleZone => {
        battleZone.draw();
    })
    player.draw();   
    foreground.draw();

    let moving = true;
    player.animate = false;

    if(battle.initiated === false) {
        // Check collision with battlezones
        if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
            for(let i = 0; i < battleZonesMap.length - 2; i++) {
                const battleZone = battleZones[i]; 
                const overlappingArea =
                (Math.min(
                    player.position.x + player.width, 
                    battleZone.position.x + battleZone.width
                    ) - 
                    Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(
                    player.position.y + player.height, 
                    battleZone.position.y + battleZone.height
                    ) - 
                    Math.max(player.position.y, battleZone.position.y));
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone
                }) && overlappingArea > (player.width * player.height) / 2
                    && Math.random() < 0.01 // Chance battle starts
                ) {
                    // Deactivate curren animation loop
                    window.cancelAnimationFrame(animationId);
                    battle.initiated = true;
                    overworldMusic.pause();
                    battleMusic.play();
                    // Flash screen animation
                    gsap.to('.flash-screen', {
                        opacity: 1,
                        repeat: 3,
                        yoyo: true,
                        duration: 0.4,
                        onComplete() {
                            gsap.to('.flash-screen', {
                                opacity: 1,
                                duration: 0.4,
                                onComplete() {
                                    // Activate new animation loop
                                    animateBattle();       
                                    gsap.to('.flash-screen', {
                                        opacity: 0,
                                        duration: 0.4                  
                                    });          
                                }
                            });     
                        }
                    });
                    break;
                }
            }
        }
    } else {
        return
    }

    if(keys.w.pressed && lastKey === 'w') {
        player.animate = true;
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
        player.animate = true;
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
        player.animate = true;
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
        player.animate = true;
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

const battleBackgroundImage = new Image();
battleBackgroundImage.src = './images/battleBackground.png';
const battleBackground = new Sprite({   
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

const draggleImage = new Image();
draggleImage.src = './images/draggleSprite.png';
const draggle = new Sprite({
    position: {
        x: 800,
        y: 100
    },
    image: draggleImage,
    frames: {
        max: 4,
        hold: 60
    }, 
    animate: true
});

const embyImage = new Image();
embyImage.src = './images/embySprite.png';
const emby = new Sprite({
    position: {
        x: 280,
        y: 325
    },
    image: embyImage,
    frames: {
        max: 4,
        hold: 40
    }, 
    animate: true
});

const renderedSprites = [draggle, emby];
function animateBattle() {
    window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    renderedSprites.forEach(sprite => {
        sprite.draw();
    })
}

// Event listeners for attack buttons
document.querySelectorAll('.attack-button').forEach((button) => {
    button.addEventListener('click', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML];
        emby.attack({ 
            attack: selectedAttack,
            recipient: draggle,
            renderedSprites
        })
    });
});

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