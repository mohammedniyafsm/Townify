import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  User,
  X,
  Plus,
  Smile,
  AtSign,
  Send,
} from "lucide-react";
import {
  getCurrentSpace,
  subscribeToSpace,
} from "@/game/scenes/sceneRegistry";
import { useSpaceChat } from "@/hooks/useSpaceChat";
import { sendSpaceChat } from "@/ws/socketHandlers";
import { useSelector } from "react-redux";
import type { RootState } from "@/Redux/stroe";

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

function SpaceChatPanel() {
  const [space, setSpace] = useState(getCurrentSpace());
  const [open, setOpen] = useState(true);
  const [text, setText] = useState("");

  const messages = useSpaceChat();
  const { user } = useSelector((state: RootState) => state.user);
  const { avatars } = useSelector((state: RootState) => state.avatars);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeToSpace(setSpace), []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, space?.id]);

  if (!space || !open) return null;

  const send = () => {
    if (!text.trim()) return;
    sendSpaceChat(text);
    setText("");
  };

  // 🔒 stable date tracking
  let lastRenderedDate = "";

  return (
    <div className="absolute right-0 top-5 z-20 h-[700px] w-96 bg-[#202540] text-white flex flex-col rounded-xl overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#23284a] to-[#1f2444] border-b border-white/10">
        <div className="flex items-center gap-3">
          <ArrowLeft className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100" />
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-sm font-bold">#</span>
          </div>
          <span className="font-semibold text-sm">
            {space.name}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray-300">
            <User className="w-4 h-4" />
            <span>1</span>
          </div>

          <X
            className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100"
            onClick={() => setOpen(false)}
          />
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 px-4 py-4 overflow-y-auto no-scrollbar">
        {messages
          .filter(m => m.spaceId === space.id)
          .map((m, i, arr) => {
            const msgDate = formatDate(m.timestamp);
            const showDate = msgDate !== lastRenderedDate;
            lastRenderedDate = msgDate;

            const isMe = m.userId === user?.id;
            const avatarUrl = avatars.find(a => a.id === m.avatarId)?.idle;
            const isLast = i === arr.length - 1;

            return (
              <div key={i} className={!isLast ? "mb-2" : ""}>
                {/* DATE SEPARATOR */}
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
                      {msgDate}
                    </span>
                  </div>
                )}

                <div
                  className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"
                    }`}
                >
                  {/* LEFT AVATAR */}
                  {!isMe && (
                    <div className="w-9 h-9 rounded-full bg-purple-600 p-[2px] flex-shrink-0">
                      {avatarUrl && (
                        <img
                          src={avatarUrl}
                          className="w-full h-full rounded-full"
                        />
                      )}
                    </div>
                  )}

                  <div className={`max-w-[72%] ${isMe ? "text-right" : ""}`}>
                    {/* NAME + TIME */}
                    <div
                      className={`flex gap-2 text-xs text-gray-400 mb-1 ${isMe ? "justify-end" : ""
                        }`}
                    >
                      {!isMe && (
                        <span className="font-semibold text-white">
                          {m.name}
                        </span>
                      )}
                      <span>{formatTime(m.timestamp)}</span>
                    </div>

                    {/* MESSAGE BUBBLE */}
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm leading-snug
                        ${isMe
                          ? "bg-green-500 text-black rounded-br-sm"
                          : "bg-white/10 rounded-bl-sm"
                        }`}
                    >
                      {m.text}
                    </div>
                  </div>

                  {/* RIGHT AVATAR */}
                  {isMe && (
                    <div className="w-9 h-9 rounded-full bg-green-500 p-[2px] flex-shrink-0">
                      {avatarUrl && (
                        <img
                          src={avatarUrl}
                          className="w-full h-full rounded-full"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        {/* SCROLL ANCHOR */}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#1b1f3b] px-3 py-2">
          <Plus className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          <Smile className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          <AtSign className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />

          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder={`Message ${space.name}`}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />

          <button
            onClick={send}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SpaceChatPanel;
