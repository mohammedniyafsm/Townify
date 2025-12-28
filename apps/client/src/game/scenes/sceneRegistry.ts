import MainScene from "./MainScene";

let mainScene: MainScene | null = null;

export const setMainScene = (scene: MainScene | null) => {
  mainScene = scene;
};

export const getMainScene = () => mainScene;
