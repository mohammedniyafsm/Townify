import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addInvitation } from "@/Redux/Slice/ManageSpace/ManageSpaceSlice";

export function useNotificationSocket(userId?: string) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!userId) return;

    const ws = new WebSocket("ws://localhost:3010");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "AUTH",
          payload: { userId },
        })
      );
    };

    ws.onmessage = e => {
      const msg = JSON.parse(e.data);

      if (msg.type === "JOIN_APPROVED") {
        window.dispatchEvent(
          new CustomEvent("JOIN_APPROVED", { detail: msg.payload })
        );
      }

      if (msg.type === "JOIN_DECLINED") {
        window.dispatchEvent(new Event("JOIN_DECLINED"));
      }

      if (msg.type === "JOIN_REQUEST_RECEIVED") {
        dispatch(addInvitation(msg.payload));
        window.dispatchEvent(
          new CustomEvent("JOIN_REQUEST_RECEIVED", {
            detail: msg.payload,
          })
        );
      }

      if (msg.type === "USER_BLOCKED") {
        window.dispatchEvent(
          new CustomEvent("USER_BLOCKED", { detail: msg.payload })
        );
      }


    };

    ws.onerror = () => {
      console.warn("⚠️ Notification WS error");
    };

    return () => {
      ws.close();
    };
  }, [userId]);
}
