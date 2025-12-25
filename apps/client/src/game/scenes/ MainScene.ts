import Phaser from "phaser";
import CameraController from "../camera/CameraController";

export default class MainScene extends Phaser.Scene {
  private mapUrl: string;

  constructor(mapUrl: string) {
    super("MainScene");
    this.mapUrl = mapUrl;
  }

  preload() {
    // Debug load errors clearly
    this.load.on("loaderror", (file: any) => {
      console.error("❌ Failed to load asset:", file.key, file.src);
    });

    // 1️⃣ Load Tiled map JSON (from DB / API / local)
    this.load.tilemapTiledJSON("map", this.mapUrl);

    // 2️⃣ Load ALL tileset images (keys MUST match Tiled tileset names)
    const TILESETS = [
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
      "floor-1",
      "Frame 1",
      "Frame 31",
      "free_overview",
      "g1",
      "g2",
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
      "WallpaperExploration"
    ];

    TILESETS.forEach((name) => {
      this.load.image(name, `/tiles/${name}.png`);
    });
  }

  create() {
    // 3️⃣ Create map
    const map = this.make.tilemap({ key: "map" });

    // 4️⃣ Bind tilesets automatically (key === tileset.name)
    const tilesets = map.tilesets
      .map((tileset) => {
        const ts = map.addTilesetImage(tileset.name, tileset.name);
        if (!ts) {
          console.warn(`⚠ Tileset not bound: ${tileset.name}`);
        }
        return ts;
      })
      .filter(
        (tileset): tileset is Phaser.Tilemaps.Tileset => tileset !== null
      );

    // 5️⃣ Create layers
    map.layers.forEach((layerData) => {
      const layer = map.createLayer(layerData.name, tilesets);
      if (!layer) return;

      // Enable collision if layer has "collides" property
      if (layerData.properties?.some((p : any) => p.name === "collides")) {
        layer.setCollisionByProperty({ collides: true });
      }
    });

    // 6️⃣ Camera controller
    new CameraController(
      this,
      map.widthInPixels,
      map.heightInPixels
    ); 

    console.log("✅ Map loaded successfully");
  }
  
}
