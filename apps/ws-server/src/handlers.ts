import  WebSocket from "ws";
import type { BroadcastMessage, MessageI } from "./types.js";
import { rooms } from "./room.js";


export const handleMessage = (ws: WebSocket, rawMessage: WebSocket.RawData) => {
    try {

        const { type, payload } = JSON.parse(rawMessage.toString()) as MessageI;
        if (!type || typeof type !== "string") return;
        if ( !payload || typeof payload !== "object") return;
        const { userId, name, roomId, x, y } = payload;

        switch (type) {
            case "JOIN_ROOM": {
                if (!rooms.has(roomId)) {
                    rooms.set(roomId, {
                        users: new Map(),
                        sockets: new Map()
                    })
                }

                const room = rooms.get(roomId);

                if (!room) return;

                room.users.set(userId, {
                    userId,
                    name,
                    x: 522,
                    y: 655
                });

                (ws as any).userId = userId;
                (ws as any).roomId = roomId;

                room.sockets.set(userId, ws);

                ws.send(JSON.stringify({
                    type: "ROOM_STATE",
                    payload: Array.from(room.users.values())
                }))

                brodCastRoom(room.sockets, {
                    type: "USER_JOINED",
                    payload: {
                        userId,
                        name,
                        x: 256,
                        y: 56,
                    },
                }, userId);
                break;
            }

            case "USER_MOVE": {
                const roomId = (ws as any).roomId;
                const userId = (ws as any).userId;

                const room = rooms.get(roomId);
                if (!room || !userId || typeof x !== "number" || typeof y !== "number") return;

                const user = room.users.get(userId);
                if (!user || !room.users.has(userId)) return;
                user.x = x;
                user.y = y;

                brodCastRoom(room.sockets, {
                    type: "USER_MOVED",
                    payload: { userId, x, y }
                }, userId)
                break;
            }

            case "LEAVE_ROOM": {
                const userId = (ws as any).userId;
                const roomId = (ws as any).roomId;

                const room = rooms.get(roomId);
                if (!room) return;
                room.users.delete(userId);
                room.sockets.delete(userId);

                delete (ws as any).userId;
                delete (ws as any).roomId;

                brodCastRoom(room.sockets, {
                    type: "USER_LEFT",
                    payload: {
                        userId: userId
                    }
                })
                if (room.users.size === 0) {
                    rooms.delete(roomId);
                }
                break;
            }
        }
    } catch (error) {
        console.error("Invalid JSON from client");
        return;
    }
}

export const handleDisconnect = (ws: WebSocket) => {
    const userId = (ws as any).userId;
    const roomId = (ws as any).roomId;

    if (!userId || !roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    room.users.delete(userId);
    room.sockets.delete(userId);

    brodCastRoom(room.sockets, {
        type: "USER_LEFT",
        payload: {
            userId: userId
        }
    });

    if (room.users.size === 0) {
        rooms.delete(roomId)
    }
}

const brodCastRoom = (
    sockets: Map<string, WebSocket>,
    message: BroadcastMessage,
    excludeUserId?: string
) => {
    sockets.forEach((socket, key) => {
        if (excludeUserId && key === excludeUserId) return;
        socket.send(JSON.stringify(message));
    })
}