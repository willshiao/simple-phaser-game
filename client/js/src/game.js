'use strict';

const game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload, create });

function preload() {
  game.load.image('einstein', 'assets/images/ra_einstein.png');
}

function create() {
  const s = game.add.sprite(80, 0, 'einstein');
  s.rotation = 0.14;
}
