import Phaser from "phaser";
import Player from "../objects/Player";
import CameraController from "../camera/CameraController";
import { setMainScene, setCurrentSpace } from "./sceneRegistry";
import { flushPendingMessages, sendJoinSpace, sendLeaveSpace } from "@/ws/socketHandlers";
import type { AvatarSchema, PlayerIdentity } from "@/types/type";
import { parseTiledValue } from "../utils/utils";



export default class MainScene extends Phaser.Scene {
  private mapUrl: string;
  private avatarMap: Record<string, AvatarSchema>;
  private localPlayerInfo: PlayerIdentity;
  private playerGroup!: Phaser.Physics.Arcade.Group;
  public isReady = false;


  private localPlayer?: Player;
  private remotePlayers = new Map<string, Player>();

  private collisionGroup!: Phaser.Physics.Arcade.StaticGroup;

  private loadObjectCollisionLayer(
    map: Phaser.Tilemaps.Tilemap,
    layerName: string
  ) {
    const layer = map.getObjectLayer(layerName);
    if (!layer) return;

    layer.objects.forEach(obj => {
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

      // 🔍 debug if needed
      // rect.setStrokeStyle(1, 0xff0000);
      rect.setVisible(false);
    });
  }

  private chairZones: Phaser.Types.Tilemaps.TiledObject[] = [];
  private spaces: Phaser.Types.Tilemaps.TiledObject[] = [];
  private currentSpaceId: string | null = null;

  // sit/stand prompt UI
  private promptContainer!: Phaser.GameObjects.Container;
  private promptLabel!: Phaser.GameObjects.Text;
  private promptBg!: Phaser.GameObjects.Graphics;
  private promptPressText!: Phaser.GameObjects.Text;
  private promptKeyBg!: Phaser.GameObjects.Graphics;
  private promptKeyText!: Phaser.GameObjects.Text;
  private promptKeyBoxW = 0;
  private promptKeyBoxH = 0;


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
      this.load.image(key, `/tiles/${key}.png`)
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

    this.loadObjectCollisionLayer(map, "collision");
    this.loadObjectCollisionLayer(map, "furniture-collision");
    this.playerGroup = this.physics.add.group();

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.roundPixels = true;

    this.createAvatarAnimations();

    const chairLayer = map.getObjectLayer("chair-zones");

    if (chairLayer) {
      this.chairZones = chairLayer.objects;
    }

    const spaceLayer = map.getObjectLayer("spaces");
    if (spaceLayer) {
      this.spaces = spaceLayer.objects;
    }

    new CameraController(this, map.widthInPixels, map.heightInPixels);

    // ---- PROMPT UI ----
    this.createPromptUI();

    this.isReady = true;
    setMainScene(this);
    flushPendingMessages();
  }



  update() {
    this.localPlayer?.update();

    if (this.localPlayer) {
      let space = null;

      // 1. If we are already in a space, check if we are still in it (with a buffer)
      // This prevents "flickering" when standing on the edge
      if (this.currentSpaceId) {
        const currentSpaceObj = this.spaces.find(s =>
          s.properties?.find((p: any) => p.name === "roomId")?.value === this.currentSpaceId
        );

        if (currentSpaceObj) {
          // Check logic specifically for this object with a 10px buffer
          const inside = (
            this.localPlayer.x >= (currentSpaceObj.x ?? 0) - 10 &&
            this.localPlayer.x <= (currentSpaceObj.x ?? 0) + (currentSpaceObj.width ?? 0) + 10 &&
            this.localPlayer.y >= (currentSpaceObj.y ?? 0) - 10 &&
            this.localPlayer.y <= (currentSpaceObj.y ?? 0) + (currentSpaceObj.height ?? 0) + 10
          );
          if (inside) {
            space = currentSpaceObj;
          }
        }
      }

      // 2. If not "sticking" to current space, look for any space (strict)
      if (!space) {
        space = this.getSpaceAt(
          this.localPlayer.x,
          this.localPlayer.y,
        );
      }

      const spaceId = space
        ? String(
          space.properties?.find((p: any) => p.name === "roomId")?.value
        )
        : null;

      if (spaceId !== this.currentSpaceId) {
        this.currentSpaceId = spaceId;
        this.onSpaceChanged(space);
      }
    }

    // ---- PROMPT VISIBILITY ----
    if (this.localPlayer && this.promptContainer) {
      if (this.localPlayer.sitting) {
        if (this.promptLabel.text !== "to stand") {
          this.promptLabel.setText("to stand");
          this.updatePromptLayout();
        }
        this.promptContainer.setPosition(this.localPlayer.x, this.localPlayer.y + 25);
        this.promptContainer.setVisible(true);
      } else if (this.getNearbyChair(this.localPlayer)) {
        if (this.promptLabel.text !== "to sit") {
          this.promptLabel.setText("to sit");
          this.updatePromptLayout();
        }
        this.promptContainer.setPosition(this.localPlayer.x, this.localPlayer.y + 25);
        this.promptContainer.setVisible(true);
      } else {
        this.promptContainer.setVisible(false);
      }
    }

    for (const p of this.remotePlayers.values()) {
      p.update();
    }
  }

  spawnLocalPlayer(user: any) {
    if (!this.isReady || this.localPlayer) return;


    this.localPlayer = new Player(
      this,
      user.x,
      user.y,
      user.avatarId,
      user.name,
      true
    );
    this.playerGroup.add(this.localPlayer);
    this.physics.add.collider(this.localPlayer, this.collisionGroup);
    this.cameras.main.startFollow(this.localPlayer, true, 0.1, 0.1);
  }

  addRemotePlayer(user: any) {
    if (!this.isReady || this.remotePlayers.has(user.userId)) return;


    const p = new Player(
      this,
      user.x,
      user.y,
      user.avatarId,
      user.name,
      false
    );
    this.playerGroup.add(p);
    this.remotePlayers.set(user.userId, p);
  }

  moveRemotePlayer(userId: string, x: number, y: number) {
    const p = this.remotePlayers.get(userId);
    if (!p) return;

    // 🔥 KILL previous tweens
    this.tweens.killTweensOf(p);

    p.playRemoteMove(x, y);

    this.tweens.add({
      targets: p,
      x,
      y,
      duration: 100, // slightly higher for smoothness
      ease: "Linear",
      onComplete: () => p.stopRemote(),
    });
  }

  removeRemotePlayer(userId: string) {
    const player = this.remotePlayers.get(userId);
    if (player) {
      this.tweens.killTweensOf(player);
      player.destroy();
      this.remotePlayers.delete(userId);
    }
  }


  getNearbyChair(player: Player) {
    const px = player.x;
    const py = player.y;

    return this.chairZones.find(obj => {
      if (obj.x == null || obj.y == null) return false;

      const dx = px - (obj.x + (obj.width ?? 0) / 2);
      const dy = py - (obj.y + (obj.height ?? 0) / 2);

      return Math.hypot(dx, dy) < 24; // distance threshold
    });
  }

  remoteSit(userId: string, chairId: number) {
    const player = this.isLocalUser(userId)
      ? this.localPlayer
      : this.remotePlayers.get(userId);

    if (!player) return;

    const chair = this.chairZones.find(obj =>
      obj.properties?.some((p: any) =>
        p.name === "chairId" &&
        Number(parseTiledValue(p.value)) === chairId
      )
    );

    if (!chair) {
      console.warn("Chair not found for chairId:", chairId);
      return;
    }

    player.sit(chair);
  }

  remoteStand(userId: any) {
    const player = this.isLocalUser(userId)
      ? this.localPlayer
      : this.remotePlayers.get(userId);

    player?.standUp();
  }

  getSpaceAt(x: number, y: number) {
    return this.spaces.find(space => {
      if (
        space.x == null ||
        space.y == null ||
        space.width == null ||
        space.height == null
      ) {
        return false;
      }

      const inside = (
        x >= space.x &&
        x <= space.x + space.width &&
        y >= space.y &&
        y <= space.y + space.height
      );

      // Debug boundary check for break-room (usually around specific coords)
      // if (space.properties?.find((p:any) => p.name === "roomId")?.value === "break-room") {
      //   console.log(`[Phaser] Checking Break Room: Player(${Math.round(x)},${Math.round(y)}) vs Rect(${space.x},${space.y},${space.width},${space.height}) => ${inside}`);
      // }

      return inside;

    });

  }

  onSpaceChanged(space?: Phaser.Types.Tilemaps.TiledObject) {
    if (!space) {
      sendLeaveSpace();
      setCurrentSpace(null);
      return;
    }


    const spaceId = String(
      space.properties?.find((p: any) => p.name === "roomId")?.value
    );
    const name = String(
      space.properties?.find((p: any) => p.name === "name")?.value
    );

    sendJoinSpace(spaceId);
    setCurrentSpace({ id: spaceId, name });

  }



  private createPromptUI() {
    const fontSize = "12px";
    const fontConfig = {
      fontSize,
      color: "#ffffff",
      fontFamily: "DM Sans, sans-serif",
    };

    this.promptPressText = this.add.text(0, 0, "Press", fontConfig).setOrigin(0, 0.5);

    this.promptKeyText = this.add.text(0, 0, "E", {
      fontSize,
      color: "#000000",
      fontStyle: "bold",
    }).setOrigin(0.5);

    const keyPad = 2;
    this.promptKeyBoxW = this.promptKeyText.width + keyPad * 2 + 6;
    this.promptKeyBoxH = this.promptKeyText.height + keyPad * 2;

    this.promptKeyBg = this.add.graphics();
    this.promptKeyBg.fillStyle(0xffffff, 1);
    this.promptKeyBg.fillRoundedRect(-this.promptKeyBoxW / 2, -this.promptKeyBoxH / 2, this.promptKeyBoxW, this.promptKeyBoxH, 3);
    this.promptKeyBg.lineStyle(1, 0x888888, 1);
    this.promptKeyBg.strokeRoundedRect(-this.promptKeyBoxW / 2, -this.promptKeyBoxH / 2, this.promptKeyBoxW, this.promptKeyBoxH, 3);

    this.promptLabel = this.add.text(0, 0, "to sit", fontConfig).setOrigin(0, 0.5);

    this.promptBg = this.add.graphics();

    this.promptContainer = this.add.container(
      0, 0,
      [this.promptBg, this.promptKeyBg, this.promptKeyText, this.promptPressText, this.promptLabel]
    );
    this.promptContainer.setDepth(1000);
    this.promptContainer.setVisible(false);

    this.updatePromptLayout();
  }

  private updatePromptLayout() {
    const padX = 8;
    const gap = 6;
    const totalW = padX + this.promptPressText.width + gap + this.promptKeyBoxW + gap + this.promptLabel.width + padX;
    const totalH = Math.max(this.promptKeyBoxH, this.promptPressText.height) + 8;

    this.promptBg.clear();
    this.promptBg.fillStyle(0x000000, 0.65);
    this.promptBg.fillRoundedRect(-totalW / 2, -totalH / 2, totalW, totalH, 8);

    let cx = -totalW / 2 + padX;
    this.promptPressText.setPosition(cx, 0);
    cx += this.promptPressText.width + gap;
    this.promptKeyBg.setPosition(cx + this.promptKeyBoxW / 2, 0);
    this.promptKeyText.setPosition(cx + this.promptKeyBoxW / 2, 0);
    cx += this.promptKeyBoxW + gap;
    this.promptLabel.setPosition(cx, 0);
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
