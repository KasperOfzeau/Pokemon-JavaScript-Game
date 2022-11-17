const draggleImage = new Image();
draggleImage.src = './images/draggleSprite.png';
const embyImage = new Image();
embyImage.src = './images/embySprite.png';

const pokemon = {
    Draggle: {
        position: {
            x: 800,
            y: 100
        },
        image: draggleImage,
        frames: {
            max: 4,
            hold: 60
        }, 
        animate: true,
        name: 'Draggle',
        isEnemy: true,
        attacks: [attacks.Tackle]
    },
    Emby: {
        position: {
            x: 280,
            y: 325
        },
        image: embyImage,
        frames: {
            max: 4,
            hold: 40
        }, 
        animate: true,
        name: "Emby",
        attacks: [attacks.Tackle, attacks.Fireball]
    }
}