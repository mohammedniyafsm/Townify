import { useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, X, Users, UserPlus, Loader2, UserX, Filter } from "lucide-react";
import type { SpaceI, SpaceInviteI } from "@repo/types";
import { useLiveKit } from "@/contexts/LiveKitContext";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/Redux/stroe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { toggleMember, approveRequestAccess, removeInvitation as removeInvitationApi } from "@/api/SpaceApi";
import { addMembers, removeInvitation, updateMemberStatus } from "@/Redux/Slice/ManageSpace/ManageSpaceSlice";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MembersModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    totalMembers: number;
}

export default function MembersModal({
    open,
    onOpenChange,
}: MembersModalProps) {
    const manageSpace = useSelector((state: RootState) => state.manageSpace);
    const { user } = useSelector((state: RootState) => state.user);
    const isAdminOrCreator = manageSpace.status === "succeeded";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="
          min-h-[80vh]
          max-h-[90vh]
          overflow-hidden
          p-0
          sm:max-w-lg
          lg:max-w-2xl 
          rounded-2xl
          border
          border-gray-200
          bg-white
          block
          shadow-xl
          backdrop:backdrop-blur-sm
          backdrop:bg-black/10
          gap-0
          [&>button]:hidden
          z-[300]
        "
                onInteractOutside={(e) => e.preventDefault()}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 pt-4 pb-0">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold text-gray-900">
                            {isAdminOrCreator ? "Manage Space" : "Members"}
                        </DialogTitle>
                        <DialogClose asChild>
                            <button
                                className="
                  rounded-full
                  p-2
                  hover:bg-gray-100
                  transition-colors
                  focus:outline-none
                  focus:ring-2
                  focus:ring-gray-300
                  focus:ring-offset-2
                "
                                onClick={() => onOpenChange(false)}
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </DialogClose>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-80px)] h-full">
                    {isAdminOrCreator && manageSpace.spaces ? (
                        <AdminView space={manageSpace.spaces} currentUser={user} />
                    ) : (
                        <RegularView />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function RegularView() {
    const { participants, room } = useLiveKit();
    const activeMembersCount = participants.length + (room ? 1 : 0);

    return (
        <div className="p-6">
            <Card className="z-[230]">
                <CardHeader>
                    <CardTitle>
                        Active Members ({activeMembersCount})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Local Participant */}
                                {room && (
                                    <TableRow>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={
                                                            room.localParticipant.metadata
                                                                ? JSON.parse(room.localParticipant.metadata).avatarImage
                                                                : ""
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {room.localParticipant.name?.charAt(0) || "?"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">
                                                        {room.localParticipant.name || "You"} (You)
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {room.localParticipant.identity}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {/* Remote Participants */}
                                {participants.map((participant) => (
                                    <TableRow key={participant.sid}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={
                                                            participant.metadata
                                                                ? JSON.parse(participant.metadata).avatarImage
                                                                : ""
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {participant.name?.charAt(0) || "?"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">
                                                        {participant.name || "Unknown"}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {participants.length === 0 && !room && (
                                    <TableRow>
                                        <TableCell colSpan={1} className="h-32 text-center">
                                            <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                                            <p className="text-muted-foreground mt-2">
                                                No members connected
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
function AdminView({ space, currentUser }: { space: SpaceI; currentUser: any }) {
    const [activeTab, setActiveTab] = useState("members");
    const [memberFilter, setMemberFilter] = useState<"online" | "offline" | "active" | "blocked" | "all">("online");
    const dispatch = useDispatch();
    const { participants, room } = useLiveKit();

    // Get active user IDs from LiveKit
    const activeUserIds = useMemo(() => {
        const ids = new Set<string>();
        if (room) {
            ids.add(room.localParticipant.identity);
        }
        participants.forEach(p => ids.add(p.identity));
        return ids;
    }, [participants, room]);

    // Filter invitations: only pending AND link type (as per original logic)
    const filteredInvitations = useMemo(() => {
        return space.invites?.filter(
            (invite) => invite.status === "pending" && invite.type === "link"
        ) || [];
    }, [space.invites]);

    // Filter members based on filter type
    const filteredMembers = useMemo(() => {
        const members = space.members || [];

        switch (memberFilter) {
            case "online":
                return members.filter(m =>
                    activeUserIds.has(m.user?.id || "") &&
                    m.status !== "blocked"
                );
            case "offline":
                return members.filter(m =>
                    !activeUserIds.has(m.user?.id || "") &&
                    m.status !== "blocked"
                );
            case "active":
                return members.filter(m => m.status !== "blocked");
            case "blocked":
                return members.filter(m => m.status === "blocked");
            case "all":
            default:
                return members;
        }
    }, [space.members, memberFilter, activeUserIds]);

    // Count members in each category
    const memberCounts = useMemo(() => {
        const all = space.members?.length || 0;
        const online = space.members?.filter(m =>
            activeUserIds.has(m.user?.id || "") &&
            m.status !== "blocked"
        ).length || 0;
        const offline = space.members?.filter(m =>
            !activeUserIds.has(m.user?.id || "") &&
            m.status !== "blocked"
        ).length || 0;
        const active = space.members?.filter(m => m.status !== "blocked").length || 0;
        const blocked = space.members?.filter(m => m.status === "blocked").length || 0;

        return {
            all,
            online,
            offline,
            active,
            blocked
        };
    }, [space.members, activeUserIds]);

    // Get display count for current filter
    const getDisplayCount = useMemo(() => {
        switch (memberFilter) {
            case "online": return memberCounts.online;
            case "offline": return memberCounts.offline;
            case "active": return memberCounts.active;
            case "blocked": return memberCounts.blocked;
            case "all": return memberCounts.all;
            default: return 0;
        }
    }, [memberFilter, memberCounts]);

    // Member logic
    const [loadingMemberMap, setLoadingMemberMap] = useState<Record<string, boolean>>({});

    const handleToggleMember = async (userId: string, memberId: string) => {
        try {
            setLoadingMemberMap((prev) => ({ ...prev, [memberId]: true }));
            const response = await toggleMember(space.slug, userId);

            dispatch(updateMemberStatus({ memberId, status: response.data.status }));
            toast.success("Member status updated");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update member");
        } finally {
            setLoadingMemberMap((prev) => ({ ...prev, [memberId]: false }));
        }
    };

    // Invitation logic
    const [loadingInviteMap, setLoadingInviteMap] = useState<Record<string, { accept: boolean; remove: boolean }>>({});

    const handleAcceptInvitation = async (invitation: SpaceInviteI) => {
        try {
            setLoadingInviteMap(prev => ({ ...prev, [invitation.id]: { ...prev[invitation.id], accept: true } }));
            const response = await approveRequestAccess(invitation.id);

            // Dispatch updates
            dispatch(removeInvitation(invitation.id)); // Remove from pending list
            dispatch(addMembers(response.data.member)); // Add to members list

            toast.success("Invitation accepted successfully");
        } catch (error: any) {
            toast.error("Failed to accept invitation");
            console.error(error);
        } finally {
            setLoadingInviteMap(prev => ({ ...prev, [invitation.id]: { ...prev[invitation.id], accept: false } }));
        }
    };

    const handleRemoveInvitation = async (invitation: SpaceInviteI) => {
        try {
            setLoadingInviteMap(prev => ({ ...prev, [invitation.id]: { ...prev[invitation.id], remove: true } }));
            await removeInvitationApi(invitation.id);

            dispatch(removeInvitation(invitation.id));
            toast.success("Invitation removed successfully");
        } catch (error: any) {
            toast.error(error?.message || "Failed to remove invitation");
        } finally {
            setLoadingInviteMap(prev => ({ ...prev, [invitation.id]: { ...prev[invitation.id], remove: false } }));
        }
    };

    const getUserNameFromEmail = (email: string): string => {
        const namePart = email.split('@')[0];
        return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    };

    return (
        <div className="p-6 pt-4 sm:pt-2">
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger
                        value="members"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
                    >
                        <span className="truncate">
                            Members ({space.members?.length || 0})
                        </span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="invitations"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
                    >
                        <span className="truncate">
                            Invitations ({filteredInvitations.length})
                        </span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="mt-4">
                    <Card className="border-0 shadow-none">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <CardTitle className="text-left">Space Members</CardTitle>
                                <div className="relative">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full sm:w-auto justify-start sm:justify-center border-gray-300 hover:bg-gray-50 z-40"
                                            >
                                                <Filter className="h-4 w-4 mr-2" />
                                                <span className="font-medium">Filter</span>
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                >
                                                    {getDisplayCount}
                                                </Badge>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg z-[500]"
                                            sideOffset={5}
                                        >
                                            <div className="px-2 py-1.5">
                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Filter Members
                                                </p>
                                            </div>
                                            <DropdownMenuItem
                                                onClick={() => setMemberFilter("online")}
                                                className={`cursor-pointer focus:bg-gray-100 ${memberFilter === "online" ? "bg-blue-50 text-blue-700" : ""}`}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                                        <span>Online</span>
                                                    </div>
                                                    <Badge variant="outline" className="ml-2 bg-gray-50">
                                                        {memberCounts.online}
                                                    </Badge>
                                                </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setMemberFilter("offline")}
                                                className={`cursor-pointer focus:bg-gray-100 ${memberFilter === "offline" ? "bg-blue-50 text-blue-700" : ""}`}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                                                        <span>Offline</span>
                                                    </div>
                                                    <Badge variant="outline" className="ml-2 bg-gray-50">
                                                        {memberCounts.offline}
                                                    </Badge>
                                                </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setMemberFilter("active")}
                                                className={`cursor-pointer focus:bg-gray-100 ${memberFilter === "active" ? "bg-blue-50 text-blue-700" : ""}`}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        <Users className="h-3.5 w-3.5 mr-2 text-gray-600" />
                                                        <span>Active (All)</span>
                                                    </div>
                                                    <Badge variant="outline" className="ml-2 bg-gray-50">
                                                        {memberCounts.active}
                                                    </Badge>
                                                </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setMemberFilter("blocked")}
                                                className={`cursor-pointer focus:bg-gray-100 ${memberFilter === "blocked" ? "bg-blue-50 text-blue-700" : ""}`}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        <UserX className="h-3.5 w-3.5 mr-2 text-red-600" />
                                                        <span>Blocked</span>
                                                    </div>
                                                    <Badge variant="outline" className="ml-2 bg-gray-50">
                                                        {memberCounts.blocked}
                                                    </Badge>
                                                </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setMemberFilter("all")}
                                                className={`cursor-pointer focus:bg-gray-100 ${memberFilter === "all" ? "bg-blue-50 text-blue-700" : ""}`}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 rounded-full bg-gray-600 mr-2"></div>
                                                        <span>All Members</span>
                                                    </div>
                                                    <Badge variant="outline" className="ml-2 bg-gray-50">
                                                        {memberCounts.all}
                                                    </Badge>
                                                </div>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="rounded-lg border border-gray-200">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                                            <TableHead className="text-left pl-6 py-3 font-medium text-gray-700">Member</TableHead>
                                            <TableHead className="hidden sm:table-cell text-left py-3 font-medium text-gray-700">Status</TableHead>
                                            {currentUser?.id === space.creatorId && <TableHead className="text-right pr-6 py-3 font-medium text-gray-700">Actions</TableHead>}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMembers.length ? (
                                            filteredMembers.map((member) => {
                                                const isLoading = loadingMemberMap[member.id];
                                                const isInSpace = activeUserIds.has(member.user?.id || "");
                                                return (
                                                    <TableRow key={member.id} className="hover:bg-gray-50">
                                                        <TableCell className="pl-6 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage src={member.user?.profile || ""} />
                                                                    <AvatarFallback>{member.user?.name?.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="text-left">
                                                                    <p className="font-medium">{member.user?.name}</p>
                                                                    <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="hidden sm:table-cell py-3">
                                                            <div className="flex gap-2">
                                                                {member.status === "blocked" ? (
                                                                    <Badge className="bg-red-50 text-red-700 border-red-200 px-2 py-0.5">
                                                                        Blocked
                                                                    </Badge>
                                                                ) : isInSpace ? (
                                                                    <Badge className="bg-green-50 text-green-700 border-green-200 px-2 py-0.5">
                                                                        Online
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 px-2 py-0.5">
                                                                        Offline
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        {currentUser?.id === space.creatorId && space.creatorId !== member.userId && (
                                                            <TableCell className="text-right pr-6 py-3">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    disabled={isLoading}
                                                                    onClick={() => handleToggleMember(member.user?.id || "", member.id)}
                                                                    className={member.status === "blocked" ? "text-green-600 hover:bg-green-50" : "text-red-600 hover:bg-red-50"}
                                                                >
                                                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : member.status === "blocked" ? <UserPlus className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                                                                    <span className="ml-2 hidden sm:inline">{member.status === "blocked" ? "Unblock" : "Block"}</span>
                                                                </Button>
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                );
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="h-48">
                                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                                        <Users className="h-12 w-12 text-gray-300 mb-4" />
                                                        <p className="text-gray-500 font-medium">No members found</p>
                                                        <p className="text-gray-400 text-sm mt-1">
                                                            {memberFilter === "online" && "No members are currently online"}
                                                            {memberFilter === "offline" && "No members are currently offline"}
                                                            {memberFilter === "active" && "No active members found"}
                                                            {memberFilter === "blocked" && "No blocked members found"}
                                                            {memberFilter === "all" && "No members in this space"}
                                                        </p>
                                                        {filteredMembers.length === 0 && memberFilter !== "all" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setMemberFilter("all")}
                                                                className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            >
                                                                Show all members
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="invitations" className="mt-4">
                    <Card className="border-0 shadow-none">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-left">Pending Link Invitations</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="rounded-lg border border-gray-200">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                                            <TableHead className="text-left pl-6 py-3 font-medium text-gray-700">User</TableHead>
                                            <TableHead className="text-right pr-6 py-3 font-medium text-gray-700">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredInvitations.length > 0 ? (
                                            filteredInvitations.map((invitation) => {
                                                const isLoadingAccept = loadingInviteMap[invitation.id]?.accept || false;
                                                const isLoadingRemove = loadingInviteMap[invitation.id]?.remove || false;
                                                const isLoading = isLoadingAccept || isLoadingRemove;
                                                const userName = invitation.userName || getUserNameFromEmail(invitation.email || "");

                                                return (
                                                    <TableRow key={invitation.id} className="hover:bg-gray-50">
                                                        <TableCell className="pl-6 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback className="bg-gray-100">{userName.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="text-left">
                                                                    <p className="font-medium">{userName}</p>
                                                                    <p className="text-sm text-muted-foreground">{invitation.email}</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">Link</Badge>
                                                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">Pending</Badge>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right pr-6 py-3">
                                                            <div className="flex gap-2 justify-end">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    disabled={isLoading}
                                                                    onClick={() => handleAcceptInvitation(invitation)}
                                                                    className="text-green-600 hover:bg-green-50 border border-green-200"
                                                                >
                                                                    {isLoadingAccept ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                                                    <span className="ml-2 hidden sm:inline">Accept</span>
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    disabled={isLoading}
                                                                    onClick={() => handleRemoveInvitation(invitation)}
                                                                    className="text-red-600 hover:bg-red-50 border border-red-200"
                                                                >
                                                                    {isLoadingRemove ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                                                                    <span className="ml-2 hidden sm:inline">Decline</span>
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} className="h-48">
                                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                                        <UserPlus className="h-12 w-12 text-gray-300 mb-4" />
                                                        <p className="text-gray-500 font-medium">No pending invitations</p>
                                                        <p className="text-gray-400 text-sm mt-1">
                                                            There are no pending link invitations at the moment
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}