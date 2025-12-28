import Phaser from "phaser";
import { sendMove } from "@/ws/socketHandlers";

type Direction = "up" | "down" | "left" | "right";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private isLocal: boolean;
  private avatarId: string;

  private lastDirection: Direction = "down";
  private lastSent = { x: 0, y: 0 };
  private speed = 150;

  // name tag
  private nameTag: Phaser.GameObjects.Container;
  private nameText: Phaser.GameObjects.Text;
  private dot: Phaser.GameObjects.Arc;
  private bg: Phaser.GameObjects.Graphics;

  private readonly BASE_FONT_SIZE = 10;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    avatarId: string,
    userName: string,
    isLocal: boolean
  ) {
    super(scene, x, y, `avatar-${avatarId}`, 0);

    this.isLocal = isLocal;
    this.avatarId = avatarId;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 1);
    this.setDepth(10);
    this.setCollideWorldBounds(true);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(28, 32);
    body.setOffset(2, 0);

    if (isLocal) {
      this.cursors = scene.input.keyboard!.createCursorKeys();
    }

    /* ---------- NAME TAG ---------- */

    this.nameText = scene.add.text(0, 0, userName, {
      fontSize: `${this.BASE_FONT_SIZE}px`,
      color: "#ffffff",
    });
    this.nameText.setOrigin(0, 0.5);

    this.dot = scene.add.circle(0, 0, 4, 0x22c55e);
    this.dot.setOrigin(0, 0.5);

    this.bg = scene.add.graphics();

    this.nameTag = scene.add.container(0, 0, [
      this.bg,
      this.dot,
      this.nameText,
    ]);
    this.nameTag.setDepth(11);

    this.updateNameLayout(this.BASE_FONT_SIZE);
  }

  private updateNameLayout(fontSize: number) {
    this.nameText.setFontSize(fontSize);

    const paddingX = 8;
    const paddingY = 4;
    const gap = 6;

    const bgWidth =
      this.dot.width + gap + this.nameText.width + paddingX * 2;
    const bgHeight = this.nameText.height + paddingY * 2;

    this.bg.clear();
    this.bg.fillStyle(0x000000, 0.65);
    this.bg.fillRoundedRect(
      -bgWidth / 2,
      -bgHeight / 2,
      bgWidth,
      bgHeight,
      8
    );

    this.dot.setPosition(-bgWidth / 2 + paddingX, 0);
    this.nameText.setPosition(this.dot.x + this.dot.width + gap, 0);
  }

  /* ---------- REMOTE ---------- */

  playRemoteMove(toX: number, toY: number) {
    const dx = toX - this.x;
    const dy = toY - this.y;

    let dir: Direction =
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0 ? "right" : "left"
        : dy > 0 ? "down" : "up";

    this.lastDirection = dir;
    this.play(`walk-${dir}-${this.avatarId}`, true);
  }

  stopRemote() {
    this.stop();
    this.setFrame(Player.IDLE_FRAMES[this.lastDirection]);
  }

  update() {
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (this.isLocal && this.cursors) {
      body.setVelocity(0);

      let moving = false;
      let dir: Direction = this.lastDirection;

      if (this.cursors.left?.isDown) {
        body.setVelocityX(-this.speed);
        dir = "left";
        moving = true;
      } else if (this.cursors.right?.isDown) {
        body.setVelocityX(this.speed);
        dir = "right";
        moving = true;
      }

      if (this.cursors.up?.isDown) {
        body.setVelocityY(-this.speed);
        dir = "up";
        moving = true;
      } else if (this.cursors.down?.isDown) {
        body.setVelocityY(this.speed);
        dir = "down";
        moving = true;
      }

      body.velocity.normalize().scale(this.speed);

      if (moving) {
        this.lastDirection = dir;
        this.play(`walk-${dir}-${this.avatarId}`, true);
      } else {
        this.stop();
        this.setFrame(Player.IDLE_FRAMES[this.lastDirection]);
      }

      const x = Math.round(this.x);
      const y = Math.round(this.y);

      if (
        Math.abs(x - this.lastSent.x) > 2 ||
        Math.abs(y - this.lastSent.y) > 2
      ) {
        sendMove(x, y);
        this.lastSent = { x, y };
      }
    }

    this.nameTag.setPosition(
      this.x,
      this.y - this.displayHeight - 8
    );

    const zoom = this.scene.cameras.main.zoom;
    const fontSize = Phaser.Math.Clamp(
      Math.round(this.BASE_FONT_SIZE * Math.pow(1 / zoom, 0.8)),
      10,
      22
    );

    this.updateNameLayout(fontSize);
  }

  destroy(fromScene?: boolean) {
    this.nameTag.destroy();
    super.destroy(fromScene);
  }

  static IDLE_FRAMES: Record<Direction, number> = {
    down: 0,
    left: 3,
    up: 6,
    right: 9,
  };
}
