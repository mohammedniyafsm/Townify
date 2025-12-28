import Phaser from "phaser";
import MainScene from "../scenes/MainScene";
import type { AvatarSchema, PlayerIdentity } from "@/types/type";

export default function createConfig(
  mapUrl: string,
  avatarMap: Record<string, AvatarSchema>,
  localPlayer: PlayerIdentity
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "game-container",
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: { debug: true },
    },
    scene: [new MainScene(mapUrl, avatarMap, localPlayer)],
  };
}

