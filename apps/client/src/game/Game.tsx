import { useEffect, useRef } from "react";
import Phaser from "phaser";
import createConfig from "./ config/phaserConfig";

interface GameProps {
  mapUrl: string;
}

export default function Game({ mapUrl }: GameProps) {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    gameRef.current = new Phaser.Game(createConfig(mapUrl));

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [mapUrl]);

  return <div id="game-container" />;
}
