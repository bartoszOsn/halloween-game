import './style.css'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './screenDimensions';
import { createMainScene } from './mainScene/createMainScene.ts';

const game = new Phaser.Game({
	  type: Phaser.AUTO,
	  width: SCREEN_WIDTH,
	  height: SCREEN_HEIGHT,
	  scene: createMainScene(),
	  physics: {
		  default: 'arcade',
		  arcade: {
			// debug: true
			debug: false
		  }
	  },
	disableContextMenu: true
});

// This is a hack to make the game available in the console.
// It's useful for debugging.
// @ts-ignore
window.game = game;