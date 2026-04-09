import { useEffect, useState } from "react";

export type ChatMessage = {
  id?: string;
  userId: string;
  text: string;
  spaceId?: string;
  name: string;
  avatarId: string;
  timestamp: number;
};

const globalMessages: ChatMessage[] = [];
let listeners: ((msg: ChatMessage | ChatMessage[]) => void)[] = [];

export const pushMessage = (rawMsg: any) => {
  // Map ts to timestamp if needed
  const timestamp = rawMsg.timestamp || rawMsg.ts || Date.now();
  const msg: ChatMessage = {
    ...rawMsg,
    timestamp,
  };

  console.log("Pushing message to listeners:", msg);

  // De-dupe check: ID match or content+timestamp fallback
  const isDuplicate = globalMessages.some(m => {
    // If both have IDs, rely on ID equality
    if (msg.id && m.id) {
      return m.id === msg.id;
    }
    // If one or both lack ID, check content similarity
    return m.userId === msg.userId &&
      m.text === msg.text &&
      Math.abs(m.timestamp - msg.timestamp) < 2000;
  });

  if (isDuplicate) {
    console.log("Duplicate message ignored:", msg.id || "no-id");
    return;
  }

  globalMessages.push(msg);
  listeners.forEach((l) => l(msg));
};

export const bulkAddMessages = (msgs: any[]) => {
  console.log("Bulk adding messages:", msgs);
  if (!Array.isArray(msgs)) {
    console.error("bulkAddMessages received non-array:", msgs);
    return;
  }

  const newMessages: ChatMessage[] = [];

  for (const raw of msgs) {
    // Map ts to timestamp if needed
    const timestamp = raw.timestamp || raw.ts || Date.now();
    const msg: ChatMessage = {
      ...raw,
      timestamp,
    };

    // De-dupe
    if (msg.id && globalMessages.some(existing => existing.id === msg.id)) {
      continue;
    }
    newMessages.push(msg);
  }

  if (newMessages.length === 0) return;

  globalMessages.push(...newMessages);
  listeners.forEach((l) => l(newMessages));
};

export const useSpaceChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(globalMessages);

  useEffect(() => {
    const handler = (payload: ChatMessage | ChatMessage[]) => {
      console.log("New message(s) received in hook:", payload);
      if (Array.isArray(payload)) {
        setMessages((prev) => [...prev, ...payload]);
      } else {
        setMessages((prev) => [...prev, payload]);
      }
    };

    listeners.push(handler);
    return () => {
      listeners = listeners.filter((l) => l !== handler);
    };
  }, []);

  return messages;
};
