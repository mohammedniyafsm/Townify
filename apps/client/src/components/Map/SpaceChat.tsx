import { useSpaceChat } from "@/hooks/useSpaceChat";
import { getCurrentSpace } from "@/game/scenes/sceneRegistry";

export default function SpaceChat() {
  const messages = useSpaceChat();
  const space = getCurrentSpace();

  if (!space) return null;

  return (
    <div style={{
      position: "absolute",
      bottom: 10,
      left: 10,
      width: 300,
      background: "#111",
      padding: 8,
      borderRadius: 6,
      color: "#fff"
    }}>
      <div style={{ fontWeight: "bold", marginBottom: 4 }}>
        {space.name}
      </div>

      <div style={{ maxHeight: 120, overflowY: "auto" }}>
        {messages
          .filter(m => m.spaceId === space.id)
          .map((m, i) => (
            <div key={i}>
              <b>{m.userId}:</b> {m.text}
            </div>
          ))}
      </div>

      {/* input stays same */}
    </div>
  );
}
