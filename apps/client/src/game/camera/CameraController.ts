import Phaser from "phaser";
import { CAMERA_CONFIG } from "./cameraConfig";

export default class CameraController {
  private camera: Phaser.Cameras.Scene2D.Camera;

  constructor(
    scene: Phaser.Scene,
    mapWidth: number,
    mapHeight: number
  ) {
    this.camera = scene.cameras.main;

    this.setBounds(mapWidth, mapHeight);
    this.setInitialZoom();
    this.enableMouseWheelZoom(scene);
  }

  /* -------------------- SETUP -------------------- */

  private setBounds(width: number, height: number) {
    this.camera.setBounds(0, 0, width, height);
  }

  private setInitialZoom() {
    this.camera.setZoom(CAMERA_CONFIG.DEFAULT_ZOOM);
  }

  private enableMouseWheelZoom(scene: Phaser.Scene) {
    scene.input.on(
      "wheel",
      (_pointer : any, _objects: any, _dx: any, dy: any) => {
        let zoom = this.camera.zoom;

        if (dy > 0) zoom -= CAMERA_CONFIG.ZOOM_STEP;
        if (dy < 0) zoom += CAMERA_CONFIG.ZOOM_STEP;

        zoom = Phaser.Math.Clamp(
          zoom,
          CAMERA_CONFIG.MIN_ZOOM,
          CAMERA_CONFIG.MAX_ZOOM
        );

        this.camera.setZoom(zoom);
      }
    );
  }

  /* -------------------- PUBLIC API -------------------- */

  follow(target: Phaser.GameObjects.GameObject) {
    this.camera.startFollow(target, true, 0.08, 0.08);
  }

  shake(duration = 200, intensity = 0.01) {
    this.camera.shake(duration, intensity);
  }
}
