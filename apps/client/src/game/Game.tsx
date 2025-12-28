import { useEffect, useRef } from "react";
import Phaser from "phaser";
import createConfig from "./config/phaserConfig";
import type { AvatarSchema, PlayerIdentity } from "@/types/type";

interface GameProps {
  mapUrl: string;
  avatarMap: Record<string, AvatarSchema>;
  localPlayer: PlayerIdentity;
}

export default function Game({
  mapUrl,
  avatarMap,
  localPlayer,
}: GameProps) {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    console.log("How many time render ")

    gameRef.current = new Phaser.Game(
      createConfig(mapUrl, avatarMap, localPlayer)
    );

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [mapUrl]);

  return <div id="game-container" />;
}

