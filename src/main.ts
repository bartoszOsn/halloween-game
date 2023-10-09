import './style.css'
import { MainScene } from './mainScene/MainScene';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './screenDimensions';

const game = new Phaser.Game({
	  type: Phaser.AUTO,
	  width: SCREEN_WIDTH,
	  height: SCREEN_HEIGHT,
	  scene: MainScene,
	  physics: {
		  default: 'arcade',
		  arcade: {
			debug: true
		  }
	  },
	disableContextMenu: true
});

// This is a hack to make the game available in the console.
// It's useful for debugging.
// @ts-ignore
window.game = game;