import './style.css'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../src/screenDimensions.ts';
import { EditorScene } from './EditorScene.ts';

new Phaser.Game({
	type: Phaser.AUTO,
	width: SCREEN_WIDTH,
	height: SCREEN_HEIGHT,
	scene: EditorScene,
	disableContextMenu: true
});