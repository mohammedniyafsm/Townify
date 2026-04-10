import { useEffect, useRef, useState } from "react";
import { ArrowLeft, User, Plus, Smile, AtSign, Send } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";

export type ChatMessage = {
  userId: string;
  text: string;
  name: string;
  avatarId: string;
  timestamp: number;
};

interface Props {
  title: string;
  messages: ChatMessage[];
  currentUserId: string;
  avatars: { id: string; idle: string }[];
  onSend: (text: string) => void;
  onBack?: () => void;
  onClose?: () => void;
  otherUnreadCount?: number;
}

const formatTime = (ts: number | undefined) => {
  if (!ts) return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return "";
  }
};

export default function ChatPanel({
  title,
  messages,
  currentUserId,
  avatars,
  onSend,
  onBack,
  onClose,
  otherUnreadCount,
}: Props) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
    setShowEmoji(false);
  };

  const onEmojiClick = (emojiObject: any) => {
    setText((prev) => prev + emojiObject.emoji);
    setShowEmoji(false);
  };

  /* Emoji Picker Ref for Click Outside */
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="absolute right-0 top-2 z-20 h-[97vh] w-96 bg-zinc-900 text-white flex flex-col rounded-xl shadow-2xl border border-white/10 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-zinc-950">
        <div className="flex items-center gap-3">
          {onBack && (
            <div className="relative cursor-pointer" onClick={onBack}>
              <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
              {otherUnreadCount && otherUnreadCount > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
                  {otherUnreadCount > 9 ? "9+" : otherUnreadCount}
                </span>
              ) : null}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-sm">{title}</span>
            <span className="text-[10px] text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh (Mock) */}
          <button className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
          </button>

          {/* Close */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-6 relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {messages.map((m, i) => {
          const isMe = m.userId === currentUserId;
          const avatar = avatars.find((a) => a.id === m.avatarId)?.idle;

          /* Date Logic */
          const currentDate = new Date(m.timestamp).toLocaleDateString();
          const prevDate =
            i > 0
              ? new Date(messages[i - 1].timestamp).toLocaleDateString()
              : null;
          const showDate = currentDate !== prevDate;

          return (
            <div key={i}>
              {/* Date Divider */}
              {showDate && (
                <div className="flex justify-center mb-4">
                  <span className="bg-white/10 text-gray-400 text-[10px] px-2 py-1 rounded-full">
                    {currentDate === new Date().toLocaleDateString()
                      ? "Today"
                      : currentDate}
                  </span>
                </div>
              )}

              {/* Message Bubble: Me=Right, Others=Left */}
              <div
                className={`flex gap-3 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {/* Avatar (Left for Others) */}
                {!isMe && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                      {avatar ? (
                        <img src={avatar} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div
                  className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {/* Me: Time Name | Someone: Name Time */}
                    {isMe ? (
                      <>
                        <span className="text-[10px] text-gray-500">{formatTime(m.timestamp)}</span>
                        <span className="text-xs font-bold text-white">{m.name}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs font-bold text-white">{m.name}</span>
                        <span className="text-[10px] text-gray-500">{formatTime(m.timestamp)}</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`px-4 py-2 rounded-2xl text-sm border
                    ${isMe
                        ? "bg-white/10 border-white/10 text-white rounded-tr-none"
                        : "bg-white/5 border-white/10 text-gray-200 rounded-tl-none"
                      }
                  `}
                  >
                    {m.text}
                  </div>
                </div>

                {/* Avatar (Right for Me) */}
                {isMe && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                      {avatar ? (
                        <img src={avatar} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-white/10 relative">
        {/* Emoji Picker Popover */}
        {showEmoji && (
          <div className="absolute bottom-16 left-4 z-50" ref={emojiPickerRef}>
            <style>{`
              aside.EmojiPickerReact .epr-body::-webkit-scrollbar {
                display: none;
              }
              aside.EmojiPickerReact .epr-body {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme={Theme.DARK}
              width={280}
              height={350}
            />
          </div>
        )}

        <div className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-xl">
          <Plus className="w-5 h-5" />
          <Smile
            className={`w-5 h-5 cursor-pointer transition-colors ${showEmoji ? "text-yellow-400" : "text-gray-400 hover:text-white"
              }`}
            onClick={() => setShowEmoji(!showEmoji)}
          />
          <AtSign className="w-5 h-5" />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") send();
            }}
            className="flex-1 bg-transparent outline-none text-sm"
            placeholder={`Message ${title}`}
          />
          <Send className="w-4 h-4 cursor-pointer" onClick={send} />
        </div>
      </div>
    </div>
  );
}
