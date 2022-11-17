const battleBackgroundImage = new Image();
battleBackgroundImage.src = './images/battleBackground.png';
const battleBackground = new Sprite({   
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

let draggle;
let emby;
let renderedSprites;
let queue;
let battleAnimationId; 

function initBattle() {
    document.querySelector('.user-interface').style.display = 'block';
    document.querySelector('.dialog').style.display = 'none';
    document.querySelector('#playerHealthBar').style.width = "100%";
    document.querySelector('#enemyHealthBar').style.width = "100%";
    document.querySelector('.attacks').replaceChildren();

    draggle = new Pokemon(pokemon.Draggle);
    emby = new Pokemon(pokemon.Emby);
    renderedSprites = [draggle, emby];
    queue = [];

    emby.attacks.forEach((attack) => {
        const button = document.createElement('button');
        button.classList.add('attack-button');
        button.innerHTML = attack.name;
        document.querySelector('.attacks').append(button);
    })

    // Event listeners for attack buttons
    document.querySelectorAll('.attack-button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            emby.attack({ 
                attack: selectedAttack,
                recipient: draggle,
                renderedSprites
            });
        
            if(draggle.health <= 0) {
                queue.push(() => {
                    draggle.faint(); 
                });
                queue.push(() => {
                    gsap.to('.flash-screen', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId);
                            animate();
                            battle.initiated = false;
                            battleMusic.pause();
                            overworldMusic.play();
                            document.querySelector('.user-interface').style.display = 'none';
                            gsap.to('.flash-screen', {
                                opacity: 0
                            });
                        }
                    });
                });
                return
            }

            const randomAttack = draggle.attacks[Math.floor(Math.random()) * draggle.attacks.length];

            queue.push(() => {
                draggle.attack({ 
                    attack: randomAttack,
                    recipient: emby,
                    renderedSprites
                });

                if(emby.health <= 0) {
                    queue.push(() => {
                        emby.faint(); 
                    });
                    queue.push(() => {
                        gsap.to('.flash-screen', {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId);
                                animate();
                                battle.initiated = false;
                                battleMusic.pause();
                                overworldMusic.play();
                                document.querySelector('.user-interface').style.display = 'none';
                                gsap.to('.flash-screen', {
                                    opacity: 0
                                });
                            }
                        });
                    });
                    return
                }
            })
        });

        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            const attackTypeContainer = document.querySelector('.attack-type');
            attackTypeContainer.innerHTML = selectedAttack.type;
            attackTypeContainer.style.color = selectedAttack.color;
        });
    });
}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    renderedSprites.forEach(sprite => {
        sprite.draw();
    })
}

document.querySelector('.dialog').addEventListener('click', (e) => {
    if(queue.length > 0) {
        queue[0]();
        queue.shift();
    } else {
        e.currentTarget.style.display = 'none';
    }
})