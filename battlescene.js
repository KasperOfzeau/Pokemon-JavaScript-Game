const battleBackgroundImage = new Image();
battleBackgroundImage.src = './images/battleBackground.png';
const battleBackground = new Sprite({   
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

const draggle = new Pokemon(pokemon.Draggle);
const emby = new Pokemon(pokemon.Emby);

const renderedSprites = [draggle, emby];

emby.attacks.forEach((attack) => {
    const button = document.createElement('button');
    button.classList.add('attack-button');
    button.innerHTML = attack.name;
    document.querySelector('.attacks').append(button);
})

function animateBattle() {
    window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    renderedSprites.forEach(sprite => {
        sprite.draw();
    })
}

const queue = [];

// Event listeners for attack buttons
document.querySelectorAll('.attack-button').forEach((button) => {
    button.addEventListener('click', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML];
        emby.attack({ 
            attack: selectedAttack,
            recipient: draggle,
            renderedSprites
        });

        queue.push(() => {
            draggle.attack({ 
                attack: attacks.Tackle,
                recipient: emby,
                renderedSprites
            });
        })
    });
});

document.querySelector('.dialog').addEventListener('click', (e) => {
    if(queue.length > 0) {
        queue[0]();
        queue.shift();
    } else {
        e.currentTarget.style.display = 'none';
    }
})