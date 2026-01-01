import MainScene from "./MainScene";

let mainScene: MainScene | null = null;

export const setMainScene = (scene: MainScene | null) => {
  mainScene = scene;
};

export const getMainScene = () => mainScene;

// 🔥 SPACE STATE
let currentSpace: { id: string; name: string } | null = null;

// 🔥 listeners
let listeners: ((space: typeof currentSpace) => void)[] = [];

export const setCurrentSpace = (space: typeof currentSpace) => {
  currentSpace = space;
  listeners.forEach(l => l(space));
};

export const getCurrentSpace = () => currentSpace;

// 🔥 React subscribes here
export const subscribeToSpace = (
  cb: (space: typeof currentSpace) => void
) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter(l => l !== cb);
  };
};
