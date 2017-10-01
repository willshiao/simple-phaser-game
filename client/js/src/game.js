'use strict';

const game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload, create, update, render });
let runner;
let cursors;
let knight;
let slashButton;
let swords;
let swordTime = 0; // Time at which the sword can be used again

function preload() {
  game.load.image('sword', 'assets/sword.png');
  game.load.spritesheet('runner', 'assets/player.png', 32, 48);
  game.load.spritesheet('knight', 'assets/knight.png', 84, 84);
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  runner = game.add.sprite(32, game.world.height - 150, 'runner');
  knight = game.add.sprite(84, game.world.height - 100, 'knight');

  game.physics.arcade.enable(runner);
  // runner.body.bounce.y = 0.2;
  // runner.body.gravity.y = 300;
  runner.body.collideWorldBounds = true;

  runner.animations.add('left', [0, 1, 2, 3], 10, true);
  runner.animations.add('right', [5, 6, 7, 8], 10, true);
  runner.anchor.setTo(0.5, 0.5);

  // The knight
  game.physics.arcade.enable(knight);
  knight.body.collideWorldBounds = true;
  knight.body.setSize(30, 80, 26, 2);
  knight.anchor.setTo(0.5, 0.5);

  // The knight's animations
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

  // Swords
  swords = game.add.group();
  swords.enableBody = true;
  swords.physicsBodyType = Phaser.Physics.ARCADE;
  swords.createMultiple(5, 'sword');
  swords.setAll('scale.x', 0.5);
  swords.setAll('scale.y', 0.5);
  swords.setAll('anchor.x', 0.5);
  swords.setAll('anchor.y', 0.5);
  swords.setAll('outOfBoundsKill', true);
  swords.setAll('checkWorldBounds', true);

  // Controls
  cursors = game.input.keyboard.createCursorKeys();
  slashButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {
  knight.body.velocity.x = 0;
  knight.body.velocity.y = 0;
  const { animations: { currentAnim } } = knight;
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

function render() {
  game.debug.body(knight, '#ffffff', false);
}

function slash({ animations, data: { facing } }) {
  const SWORD_SPEED = 200;
  if(facing === 'up') {
    animations.play('attackUp');
    fireSword(0, 0, 0, -SWORD_SPEED, -90);
  } else if(facing === 'down') {
    animations.play('attackDown');
    fireSword(0, 0, 0, SWORD_SPEED, 90);
  } else if(facing === 'right') {
    animations.play('attackRight');
    fireSword(0, 0, SWORD_SPEED, 0);
  } else if(facing === 'left') {
    animations.play('attackLeft');
    fireSword(0, 0, -SWORD_SPEED, 0, 180);
  }
}

function fireSword(xOffset, yOffset, xVelocity, yVelocity, angle = 0) {
  if(game.time.now > swordTime) {
    const sword = swords.getFirstExists(false);

    if(sword) {
      sword.reset(knight.x + xOffset, knight.y + yOffset);
      sword.body.velocity.x = xVelocity;
      sword.body.velocity.y = yVelocity;
      sword.angle = angle;
      swordTime = game.time.now + 500;
    }
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
