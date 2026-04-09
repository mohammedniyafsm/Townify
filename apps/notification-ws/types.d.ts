export type SpaceEvent = {
    type: "JOIN_REQUEST";
    payload: {
        adminUserId: string;
        requester: {
            userId: string;
            userName: string;
            email: string;
            inviteId: string;
        };
    };
} | {
    type: "JOIN_APPROVED";
    payload: {
        userId: string;
        spaceSlug: string;
        spaceName: string;
    };
};
//# sourceMappingURL=types.d.ts.map