const pokemon = {
    Draggle: {
        position: {
            x: 800,
            y: 100
        },
        image: {
            src: './images/draggleSprite.png'
        },
        frames: {
            max: 4,
            hold: 60
        }, 
        animate: true,
        name: 'Draggle',
        isEnemy: true,
        attacks: [attacks.Tackle, attacks.Fireball]
    },
    Emby: {
        position: {
            x: 280,
            y: 325
        },
        image: {
            src: './images/embySprite.png'
        },
        frames: {
            max: 4,
            hold: 40
        }, 
        animate: true,
        name: "Emby",
        attacks: [attacks.Tackle, attacks.Fireball]
    }
}