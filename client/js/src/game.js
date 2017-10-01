'use strict';

const game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload, create, update });
let player;
let cursors;
let knight;
let slashButton;

function preload() {
  game.load.spritesheet('player', 'assets/player.png', 32, 48);
  game.load.spritesheet('knight', 'assets/knight.png', 84, 84);
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  player = game.add.sprite(32, game.world.height - 150, 'player');
  knight = game.add.sprite(84, game.world.height - 100, 'knight');

  game.physics.arcade.enable(player);
  // player.body.bounce.y = 0.2;
  // player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);
  player.anchor.setTo(0.5, 0.5);

  game.physics.arcade.enable(knight);
  knight.animations.add('idle', iRange(0, 3), 15, true);
  knight.animations.add('down', iRange(4, 8), 15, true);
  knight.animations.add('up', iRange(9, 13), 15, true);
  knight.animations.add('right', iRange(14, 19), 15, true);
  knight.animations.add('left', iRange(20, 25), 15, true);
  knight.animations.add('attackDown', [...iRange(26, 28), 27], 15);
  knight.animations.add('attackUp', [...iRange(29, 31), 30], 15);
  knight.animations.add('attackRight', iRange(32, 34), 15);
  knight.animations.add('attackLeft', iRange(35, 37), 15);

  knight.animations.play('idle');

  cursors = game.input.keyboard.createCursorKeys();
  slashButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {
  knight.body.velocity.x = 0;
  knight.body.velocity.y = 0;
  const currentAnim = knight.animations.currentAnim;
  // knight.data.facing = 'none';

  if(slashButton.isDown && (!currentAnim.name.includes('attack') || currentAnim.isFinished)) {
    slash(knight);
  } else if(currentAnim.name.includes('attack') && !currentAnim.isFinished) {
    // Do nothing
  } else if(cursors.left.isDown) {
    knight.body.velocity.x = -150;
    knight.data.facing = 'left';
    knight.animations.play('left');
  } else if(cursors.right.isDown) {
    knight.body.velocity.x = 150;
    knight.data.facing = 'right';
    knight.animations.play('right');
  } else if(cursors.up.isDown) {
    knight.body.velocity.y = -150;
    knight.data.facing = 'up';
    knight.animations.play('up');
  } else if(cursors.down.isDown) {
    knight.body.velocity.y = 150;
    knight.data.facing = 'down';
    knight.animations.play('down');
  } else if(!knight.animations.currentAnim.name.includes('attack')) {
    knight.animations.play('idle');
  }
}

function slash({ animations, data: { facing } }) {
  if(facing === 'up') {
    animations.play('attackUp');
  } else if(facing === 'down') {
    animations.play('attackDown');
  } else if(facing === 'right') {
    animations.play('attackRight');
  } else if(facing === 'left') {
    animations.play('attackLeft');
  }
}

// Generates an array from start (inclusive) to end (inclusive)
function iRange(start, end) {
  return Array.from({ length: (end - start) + 1 }, (value, key) => key + start);
}

// Generates an array from start (inclusive) to end (exclusive)
function nRange(start, end) {
  return Array.from({ length: end - start }, (value, key) => key + start);
}
