import WebSocket from "ws";
import type { BroadcastMessage, MessageI } from "./types.js";
import { rooms } from "./room.js";


export const handleMessage = (ws: WebSocket, rawMessage: WebSocket.RawData) => {
    try {

        const { type, payload } = JSON.parse(rawMessage.toString()) as MessageI;
        if (!type || typeof type !== "string") return;
        if (!payload || typeof payload !== "object") return;
        const { userId, name, roomId, x, y, avatarId, isSitting, chairId, facing } = payload;

        switch (type) {
            case "JOIN_ROOM": {
                if (!rooms.has(roomId)) {
                    rooms.set(roomId, {
                        users: new Map(),
                        sockets: new Map(),
                        chairs: new Map()
                    })
                }

                const room = rooms.get(roomId);

                if (!room) return;

                room.users.set(userId, {
                    userId,
                    name,
                    avatarId,
                    x: 522,
                    y: 655,
                    isSitting: false,
                    chairId: null,
                    facing: null
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
                        avatarId,
                        x: 522,
                        y: 655,
                        isSitting: false,
                        chairId: null,
                        facing: null
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

            case "SIT": {
                const userId = (ws as any).userId;
                const roomId = (ws as any).roomId;

                if (!userId || !roomId || chairId == null || !facing || typeof chairId !== "number") return;

                const room = rooms.get(roomId);
                if (!room) return;

                if (room.chairs.has(chairId)) {
                    ws.send(JSON.stringify({
                        type: "SIT_REJECTED",
                        payload: { chairId }
                    }));
                    return;
                }

                const user = room.users.get(userId);
                if (!user) return;

                // 🔒 lock chair
                room.chairs.set(chairId, userId);

                user.isSitting = true;
                user.chairId = chairId;
                user.facing = facing;

                brodCastRoom(
                    room.sockets,
                    {
                        type: "USER_SIT",
                        payload: { userId, chairId, facing },
                    },
                );

                break;
            }

            case "STAND": {
                const userId = (ws as any).userId;
                const roomId = (ws as any).roomId;

                if (!userId || !roomId) return;

                const room = rooms.get(roomId);
                if (!room) return;

                const user = room.users.get(userId);
                if (!user) return;

                if (user.chairId != null) {
                    room.chairs.delete(user.chairId); // 🔓 unlock chair
                }

                user.isSitting = false;
                user.chairId = null;
                user.facing = null;

                brodCastRoom(
                    room.sockets,
                    {
                        type: "USER_STAND",
                        payload: { userId },
                    },
                    userId
                );

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

    const user = room.users.get(userId);
    if (user?.chairId != null) {
        room.chairs.delete(user.chairId);
    }

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