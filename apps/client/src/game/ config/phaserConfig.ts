import Phaser from "phaser";
import MainScene from "../scenes/ MainScene";

export default function createConfig(mapUrl: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "game-container",
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: { debug: true }
    },
    scene: [new MainScene(mapUrl)]
  };
}
