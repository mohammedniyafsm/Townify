import WebSocket from "ws";
import type { BroadcastMessage, MessageI } from "./types.js";
import { rooms } from "./room.js";
import {
    addRoomMessage,
    getRoomMessages,
    handleUserJoinRoom,
    handleUserLeaveRoom,
} from "@repo/cache"


export const handleMessage = async (ws: WebSocket, rawMessage: WebSocket.RawData) => {
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
                        chairs: new Map(),
                        spaces: new Map()
                    })
                }

                const room = rooms.get(roomId);

                if (!room) return;

                if (room.users.has(userId)) return;

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
                (ws as any).spaceId = null;
                (ws as any).name = name;
                (ws as any).avatarId = avatarId;

                room.sockets.set(userId, ws);

                await handleUserJoinRoom(roomId, userId);
                const history = await getRoomMessages(roomId);

                ws.send(JSON.stringify({
                    type: "ROOM_STATE",
                    payload: Array.from(room.users.values())
                }))

                ws.send(
                    JSON.stringify({
                        type: "ROOM_CHAT_HISTORY",
                        payload: {
                            history,
                        },
                    })
                );

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
                const name = (ws as any).name;

                const room = rooms.get(roomId);
                if (!room || !userId || typeof x !== "number" || typeof y !== "number") return;

                const user = room.users.get(userId);
                if (!user || !room.users.has(userId)) return;
                user.x = x;
                user.y = y;

                brodCastRoom(room.sockets, {
                    type: "USER_MOVED",
                    payload: { userId, name, x, y }
                }, userId)
                break;
            }

            case "LEAVE_ROOM": {
                const userId = (ws as any).userId;
                const roomId = (ws as any).roomId;
                const spaceId = (ws as any).spaceId;
                const name = (ws as any).name;

                const room = rooms.get(roomId);
                if (!room) return;

                if (spaceId) {
                    room.spaces.get(spaceId)?.delete(userId);
                }
                (ws as any).spaceId = null;
                room.users.delete(userId);
                room.sockets.delete(userId);

                delete (ws as any).userId;
                delete (ws as any).roomId;

                await handleUserLeaveRoom(roomId, userId);

                brodCastRoom(room.sockets, {
                    type: "USER_LEFT",
                    payload: {
                        userId: userId,
                        name: name
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
                const name = (ws as any).name;

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
                const name = (ws as any).name;

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
                        payload: { userId, name },
                    },
                    userId
                );

                break;
            }

            case "JOIN_SPACE": {
                const userId = (ws as any).userId;
                const roomId = (ws as any).roomId;
                const name = (ws as any).name;
                const { spaceId } = payload;

                if (!userId || !roomId || !spaceId) return;

                const room = rooms.get(roomId);
                if (!room) return;

                const prevSpaceId = (ws as any).spaceId;
                if (prevSpaceId) {
                    room.spaces.get(prevSpaceId)?.delete(userId);
                }

                if (!room.spaces.has(spaceId)) {
                    room.spaces.set(spaceId, new Set());
                }

                room.spaces.get(spaceId)!.add(userId);
                (ws as any).spaceId = spaceId;

                const usersInSpace = room.spaces.get(spaceId);

                await handleUserJoinRoom(roomId, userId, spaceId);

                const history = await getRoomMessages(roomId, 50, spaceId);

                ws.send(
                    JSON.stringify({
                        type: "SPACE_CHAT_HISTORY",
                        payload: {
                            history,
                        },
                    })
                );

                usersInSpace?.forEach((uid) => {
                    const socket = room.sockets.get(uid);
                    socket?.send(JSON.stringify({
                        type: "USER_JOINED_SPACE",
                        payload: {
                            userId,
                            name,
                            spaceId,
                        }
                    }));
                })

                break;
            }

            case "LEAVE_SPACE": {
                const userId = (ws as any).userId;
                const roomId = (ws as any).roomId;
                const name = (ws as any).name;
                const spaceId = (ws as any).spaceId;

                if (!userId || !roomId) return;

                const room = rooms.get(roomId);
                if (!room) return;

                const usersInSpace = room.spaces.get(spaceId);

                await handleUserLeaveRoom(roomId, userId, spaceId);

                usersInSpace?.forEach((uid) => {
                    const socket = room.sockets.get(uid);
                    socket?.send(JSON.stringify({
                        type: "USER_LEAVED_SPACE",
                        payload: {
                            userId,
                            name,
                            spaceId,
                        }
                    }))
                });

                if (spaceId) {
                    room.spaces.get(spaceId)?.delete(userId);
                    (ws as any).spaceId = null;
                }

                break;
            }

            case "ROOM_CHAT": {
                const userId = (ws as any).userId;
                const roomId = (ws as any).roomId;
                const name = (ws as any).name;
                const avatarId = (ws as any).avatarId;
                const { text } = payload;

                if (!userId || !roomId || !name || !text || !avatarId) return;

                const room = rooms.get(roomId);

                if (!room) return;

                if (!room.users.has(userId)) return;

                const message = await addRoomMessage(
                    roomId,
                    userId,
                    name,
                    avatarId,
                    text
                );

                brodCastRoom(room.sockets, {
                    type: "ROOM_CHAT",
                    payload: {
                        ...message,
                    }
                });
                break;
            }

            case "SPACE_CHAT": {
                const userId = (ws as any).userId;
                const roomId = (ws as any).roomId;
                const spaceId = (ws as any).spaceId;
                const name = (ws as any).name;
                const avatarId = (ws as any).avatarId;
                const { text } = payload;

                if (!userId || !roomId || !spaceId || !text) return;

                const room = rooms.get(roomId);
                if (!room) return;

                if (!room.users.has(userId)) return;

                const usersInSpace = room.spaces.get(spaceId);
                if (!usersInSpace) return;

                if (!usersInSpace.has(userId)) return;

                const message = await addRoomMessage(
                    roomId,
                    userId,
                    name,
                    avatarId,
                    text,
                    spaceId
                );

                usersInSpace.forEach(uid => {
                    const socket = room.sockets.get(uid);
                    if (socket?.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({
                            type: "SPACE_CHAT",
                            payload: {
                                ...message,
                            }
                        }));
                    }
                });

                break;
            }

        }
    } catch (error) {
        console.error("Invalid JSON from client");
        return;
    }
}

export const handleDisconnect = async (ws: WebSocket) => {
    const userId = (ws as any).userId;
    const roomId = (ws as any).roomId;
    const spaceId = (ws as any).spaceId;

    if (!userId || !roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const user = room.users.get(userId);
    if (user?.chairId != null) {
        room.chairs.delete(user.chairId);
    }

    room.users.delete(userId);
    room.sockets.delete(userId);

    if (spaceId) {
        room.spaces.get(spaceId)?.delete(userId);
        await handleUserLeaveRoom(roomId, userId, spaceId);
    }
    await handleUserLeaveRoom(roomId, userId);

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
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    })
}