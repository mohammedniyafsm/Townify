import Phaser from "phaser";
import Player from "../objects/Player";
import CameraController from "../camera/CameraController";
import { setMainScene } from "./sceneRegistry";
import { flushPendingMessages } from "@/ws/socketHandlers";
import type { AvatarSchema, PlayerIdentity } from "@/types/type";

export default class MainScene extends Phaser.Scene {
  private mapUrl: string;
  private avatarMap: Record<string, AvatarSchema>;
  private localPlayerInfo: PlayerIdentity;

  private localPlayer?: Player;
  private remotePlayers = new Map<string, Player>();

  private collisionGroup!: Phaser.Physics.Arcade.StaticGroup;


  constructor(
    mapUrl: string,
    avatarMap: Record<string, AvatarSchema>,
    localPlayerInfo: PlayerIdentity
  ) {
    super("MainScene");
    this.mapUrl = mapUrl;
    this.avatarMap = avatarMap;
    this.localPlayerInfo = localPlayerInfo;
  }

  isLocalUser(userId: string) {
    return this.localPlayerInfo.userId === userId;
  }

  preload() {
    this.load.tilemapTiledJSON("map", this.mapUrl);

    TILESETS.forEach(key => {
      this.load.image(key, `/tiles/${key}.png`);
    });

    // load ALL avatar spritesheets
    Object.values(this.avatarMap).forEach(a => {
      this.load.spritesheet(`avatar-${a.id}`, a.walkSheet, {
        frameWidth: a.frameWidth ?? 32,
        frameHeight: a.frameHeight ?? 32,
      });
    });
  }

  create() {
    setMainScene(this);

    const map = this.make.tilemap({ key: "map" });

    const tilesets = map.tilesets
      .map(ts => map.addTilesetImage(ts.name, ts.name))
      .filter((t): t is Phaser.Tilemaps.Tileset => t !== null);

    map.layers.forEach((layerData, index) => {
      const layer = map.createLayer(layerData.name, tilesets);
      if (!layer) return;
      layer.setDepth(index);
    });

    // ---- OBJECT LAYER COLLISION ----
    this.collisionGroup = this.physics.add.staticGroup();

    const collisionLayer = map.getObjectLayer("collision");

    if (collisionLayer) {
      collisionLayer.objects.forEach(obj => {
        if (
          obj.x == null ||
          obj.y == null ||
          obj.width == null ||
          obj.height == null
        )
          return;

        const rect = this.add.rectangle(
          obj.x + obj.width / 2,
          obj.y + obj.height / 2,
          obj.width,
          obj.height
        );

        this.physics.add.existing(rect, true);
        this.collisionGroup.add(rect);

        // 🔥 IMPORTANT: hide collision rectangles
        rect.setVisible(false);
      });
    }

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.roundPixels = true;

    this.createAvatarAnimations();

    new CameraController(this, map.widthInPixels, map.heightInPixels);

    flushPendingMessages();
  }

  update() {
    this.localPlayer?.update();
    for (const p of this.remotePlayers.values()) p.update();
  }

  spawnLocalPlayer(user: any) {
    if (this.localPlayer) return;

    this.localPlayer = new Player(
      this,
      user.x,
      user.y,
      user.avatarId,
      user.name,
      true
    );
    this.physics.add.collider(this.localPlayer, this.collisionGroup);
    this.cameras.main.startFollow(this.localPlayer, true, 0.1, 0.1);
  }

  addRemotePlayer(user: any) {
    if (this.remotePlayers.has(user.userId)) return;

    const p = new Player(
      this,
      user.x,
      user.y,
      user.avatarId,
      user.name,
      false
    );

    this.remotePlayers.set(user.userId, p);
  }

  moveRemotePlayer(userId: string, x: number, y: number) {
    const p = this.remotePlayers.get(userId);
    if (!p) return;

    p.playRemoteMove(x, y);

    this.tweens.add({
      targets: p,
      x,
      y,
      duration: 80,
      ease: "Linear",
      onComplete: () => p.stopRemote(),
    });
  }

  removeRemotePlayer(userId: string) {
    this.remotePlayers.get(userId)?.destroy();
    this.remotePlayers.delete(userId);
  }

  // 🔥 IMPORTANT FIX: animations PER avatar
  private createAvatarAnimations() {
    Object.values(this.avatarMap).forEach(a => {
      const key = `avatar-${a.id}`;

      if (this.anims.exists(`walk-down-${a.id}`)) return;

      this.anims.create({
        key: `walk-down-${a.id}`,
        frames: this.anims.generateFrameNumbers(key, { start: 1, end: 2 }),
        frameRate: 8,
        repeat: -1,
      });

      this.anims.create({
        key: `walk-left-${a.id}`,
        frames: this.anims.generateFrameNumbers(key, { start: 4, end: 5 }),
        frameRate: 8,
        repeat: -1,
      });

      this.anims.create({
        key: `walk-up-${a.id}`,
        frames: this.anims.generateFrameNumbers(key, { start: 7, end: 8 }),
        frameRate: 8,
        repeat: -1,
      });

      this.anims.create({
        key: `walk-right-${a.id}`,
        frames: this.anims.generateFrameNumbers(key, { start: 10, end: 11 }),
        frameRate: 8,
        repeat: -1,
      });
    });
  }
}

const TILESETS = [
  "floor-1",
  "g1",
  "g2",
  "booth",
  "booth big black [5x5]",
  "botanical_garden",
  "cabinet_chippendale_thin_arch",
  "chair_neonoir",
  "chair_small (1)",
  "chair_space",
  "cushion",
  "desk_cyberpunk (1)",
  "desk_round",
  "dresser_1x2_drawers",
  "flag_jolly_roger",
  "Frame 1",
  "Frame 31",
  "free_overview",
  "ikea_shelf",
  "lamp_floor",
  "life support",
  "m-bg",
  "more walls",
  "office_filecabinets",
  "officeplants[1x1]",
  "officeplants[2x1]",
  "plant_potted_skinny_terracotta",
  "planter_boxes",
  "Room_Builder_free_32x32",
  "roundtable",
  "shelf-1",
  "sofa",
  "straigh table1",
  "table_round_marble",
  "vending_machine",
  "vending_machine@2x",
  "WallpaperExploration",
];
