import { useEffect, useState } from "react";
import { Building2, MapPin, RotateCcw, SquarePen, X } from "lucide-react";
import { getCurrentSpace, subscribeToSpace } from "@/game/scenes/sceneRegistry";
import { useSpaceChat } from "@/hooks/useSpaceChat";
import { sendSpaceChat } from "@/ws/socketHandlers";

function SpaceChatPanel() {
  const [space, setSpace] = useState(getCurrentSpace());
  const [open, setOpen] = useState(true);
  const [text, setText] = useState("");

  const messages = useSpaceChat();

  // 🔥 React to Phaser space enter / leave
  useEffect(() => {
    return subscribeToSpace(setSpace);
  }, []);

  // 🚫 No space → no chat
  if (!space || !open) return null;

  const send = () => {
    if (!text.trim()) return;
    sendSpaceChat(text);
    setText("");
  };

  return (
    <div className="flex justify-end absolute right-0 top-0 z-20">
      <div className="h-screen w-96 bg-[#202540] text-white flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h1 className="text-lg font-semibold">Chat</h1>

          <div className="flex gap-4">
            <RotateCcw className="w-5 h-5 cursor-pointer hover:text-blue-400" />
            <SquarePen className="w-5 h-5 cursor-pointer hover:text-green-400" />
            <X
              className="w-5 h-5 cursor-pointer hover:text-red-400"
              onClick={() => setOpen(false)}
            />
          </div>
        </div>

        {/* Space Info */}
        <div className="p-4 space-y-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Building2 className="w-12 h-12 bg-blue-700 p-3 rounded-full" />
            <h1 className="text-sm font-bold">{space.name}</h1>
          </div>

          <div className="flex items-center gap-4">
            <MapPin className="w-12 h-12 bg-red-500 p-3 rounded-full" />
            <h1 className="text-sm font-bold">Inside Space</h1>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {messages
            .filter(m => m.spaceId === space.id)
            .map((m, i) => (
              <div key={i} className="text-sm">
                <b className="text-blue-400">{m.userId}</b>: {m.text}
              </div>
            ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type a message..."
            className="w-full rounded bg-[#2b315a] px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export default SpaceChatPanel;
