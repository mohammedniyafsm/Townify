import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Mail,
  Link as LinkIcon,
  UserPlus,
  Check,
  X,
  Calendar,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { SpaceI, SpaceInviteI, SpaceMembersI } from "@repo/types";
import InviteMembersModal from "./InvitememberModal";
import {
  approveRequestAccess,
  removeInvitation,
  bulkRemoveInvitations,
  bulkApproveInvitations
} from "@/api/SpaceApi";
import { toast } from "sonner";

// Define loading state types
type LoadingState = {
  [inviteId: string]: {
    accept: boolean;
    remove: boolean;
  };
};

function InvitationsTab({
  spaceDetails,
  setSpaceDetails
}: {
  spaceDetails: SpaceI | null;
  setSpaceDetails: React.Dispatch<React.SetStateAction<SpaceI | null>>;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<
    "all" | "email" | "link" | "pending" | "approved"
  >("all");
  const [filteredInvitations, setFilteredInvitations] = useState<SpaceInviteI[] | null>(null);
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<{
    all: number;
    email: number;
    link: number;
    pending: number;
    approved: number;
  }>();
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Track loading states per invitation
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  useEffect(() => {
    if (!spaceDetails) return;
    const filtered = spaceDetails?.invites?.filter((inv) => {
      if (filter === "all") return true;
      if (filter === "email") return inv.type === "email";
      if (filter === "link") return inv.type === "link";
      if (filter === "pending") return inv.status === "pending";
      if (filter === "approved") return inv.status === "approved";
      return true;
    });
    const counts = {
      all: spaceDetails?.invites?.length || 0,
      email: spaceDetails?.invites?.filter((inv) => inv.type === "email").length || 0,
      link: spaceDetails?.invites?.filter((inv) => inv.type === "link").length || 0,
      pending: spaceDetails?.invites?.filter((inv) => inv.status === "pending").length || 0,
      approved: spaceDetails?.invites?.filter((inv) => inv.status === "approved").length || 0,
    };
    setCounts(counts);
    setFilteredInvitations(filtered || null);

    // Clear selection when filtered invitations change
    setSelectedIds(prev => prev.filter(id =>
      filtered?.some(inv => inv.id === id)
    ));
  }, [spaceDetails, filter]);

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    const payload = customEvent.detail;

    if (!payload) return;

    const newInvite: SpaceInviteI = {
      id: payload.id,
      email: payload.email,
      userId: payload.userId,
      spaceId: payload.spaceId,
      status: payload.status,
      type: payload.type,
      createdAt: payload.createdAt,
      inviteId: payload.inviteId,
      userName: payload.userName
    };

    setSpaceDetails(prev => {
      if (!prev) return prev;

      // Prevent duplicates
      const exists = prev.invites?.some(inv => inv.id === newInvite.id);
      if (exists) return prev;

      return {
        ...prev,
        invites: [newInvite, ...(prev.invites || [])]
      };
    });
  };

  useEffect(() => {
    window.addEventListener("JOIN_REQUEST_RECEIVED", handler as EventListener);

    return () => {
      window.removeEventListener("JOIN_REQUEST_RECEIVED", handler as EventListener);
    };
  }, []);


  // Check if all visible items are selected
  const allSelected =
    (filteredInvitations?.length || 0) > 0 &&
    filteredInvitations?.every((inv) => selectedIds.includes(inv.id));

  // Handlers
  const toggleSelectAll = () => {
    if (!filteredInvitations) return;

    if (allSelected) {
      // Deselect all
      setSelectedIds([]);
    } else {
      // Select all filtered invitations
      const allIds = filteredInvitations.map(inv => inv.id);
      setSelectedIds(allIds);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(invId => invId !== id)
        : [...prev, id]
    );
  };

  // Helper function to set loading state for a specific invitation
  const setInvitationLoading = (inviteId: string, action: 'accept' | 'remove', isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [inviteId]: {
        ...prev[inviteId],
        [action]: isLoading
        // Only set the specific action's loading state, don't touch the other
      }
    }));
  };

  const handleRemoveInvitation = async (invitation: SpaceInviteI) => {
    // Set loading state only for remove action
    setInvitationLoading(invitation.id, 'remove', true);

    try {
      await removeInvitation(invitation.id);
      if (spaceDetails) {
        const updatedInvites = spaceDetails?.invites?.filter(
          (inv) => inv.id !== invitation.id
        );
        const updatedMembers = spaceDetails?.members?.filter((mem) => {
          return mem?.user?.email !== invitation.email;
        });
        setSpaceDetails({ ...spaceDetails, invites: updatedInvites, members: updatedMembers });
      }
      toast.success("Invitation removed successfully", { duration: 1000 });
    } catch (error: any) {
      console.error("Error removing invitation:", error);
      if (error?.message) {
        toast.error(error.message, { duration: 1000 });
      } else {
        toast.error("Failed to remove invitation", { duration: 1000 });
      }
    } finally {
      // Reset loading state
      setInvitationLoading(invitation.id, 'remove', false);
    }
  };

  const handleAcceptInvitation = async (invitation: SpaceInviteI) => {
    // Set loading state only for accept action
    setInvitationLoading(invitation.id, 'accept', true);

    try {
      const response = await approveRequestAccess(invitation.id);
      const updatedInvites: SpaceInviteI[] | undefined = spaceDetails?.invites?.map((inv) => {
        if (inv.id === invitation.id) {
          return { ...inv, status: "approved" };
        }
        return inv;
      });
      const member: SpaceMembersI = response.data.member;
      const updatedMembers: SpaceMembersI[] = [...(spaceDetails?.members ?? []), member];
      if (spaceDetails) {
        setSpaceDetails({ ...spaceDetails, invites: updatedInvites, members: updatedMembers });
      }
      toast.success("Invitation accepted successfully", { duration: 1000 });
    } catch (error: any) {
      toast.error("Failed to accept invitation", { duration: 1000 });
      console.log("Error accepting invitation:", error);
    } finally {
      // Reset loading state
      setInvitationLoading(invitation.id, 'accept', false);
    }
  };

  const handleBulkRemove = async () => {
    if (selectedIds.length === 0 || !spaceDetails || isProcessingBulk) return;
    setIsProcessingBulk(true);
    try {
      const response = await bulkRemoveInvitations(spaceDetails.slug, selectedIds);

      if (spaceDetails) {
        const updatedInvites = spaceDetails.invites?.filter(
          inv => !selectedIds.includes(inv.id)
        ) || [];

        const selectedInvitations = spaceDetails.invites?.filter(
          inv => selectedIds.includes(inv.id)
        ) || [];

        const emailsToRemove = selectedInvitations.map(inv => inv.email);
        const updatedMembers = spaceDetails.members?.filter(member =>
          !emailsToRemove.includes(member.user?.email)
        ) || [];

        setSpaceDetails({
          ...spaceDetails,
          invites: updatedInvites,
          members: updatedMembers
        });
      }
      toast.success(response.data.message || "Selected invitations removed successfully", { duration: 1000 });
      setSelectedIds([]);
    } catch (error: any) {
      console.error("Error in bulk remove:", error);
      toast.error(
        error.response?.data?.message || "Failed to remove invitations",
        { duration: 3000 }
      );
    } finally {
      setIsProcessingBulk(false);
    }
  };

  const handleBulkAccept = async () => {
    if (selectedIds.length === 0 || !spaceDetails || isProcessingBulk) return;
    setIsProcessingBulk(true);
    try {
      const selectedInvitations = spaceDetails.invites?.filter(
        inv => selectedIds.includes(inv.id) && inv.status === "pending" && inv.type === "link"
      ) || [];

      if (selectedInvitations.length === 0) {
        toast.error("No pending link invitations selected for approval");
        return;
      }

      const pendingLinkIds = selectedInvitations.map(inv => inv.id);
      const response = await bulkApproveInvitations(spaceDetails.slug, pendingLinkIds);

      if (spaceDetails) {
        const updatedInvites = spaceDetails.invites?.map(inv => {
          if (pendingLinkIds.includes(inv.id)) {
            return { ...inv, status: "approved" as const };
          }
          return inv;
        }) || [];

        const newMembers = response.data?.members || [];
        const updatedMembers = [...(spaceDetails.members || []), ...newMembers];

        setSpaceDetails({
          ...spaceDetails,
          invites: updatedInvites,
          members: updatedMembers
        });
      }
      toast.success(response.data.message || "Selected invitations approved successfully", { duration: 1000 });
      const remainingSelectedIds = selectedIds.filter(id =>
        !pendingLinkIds.includes(id)
      );
      setSelectedIds(remainingSelectedIds);

    } catch (error: any) {
      console.error("Error in bulk accept:", error);
      toast.error(
        error.response?.data?.message || "Failed to approve invitations",
        { duration: 3000 }
      );
    } finally {
      setIsProcessingBulk(false);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Invalid date";
    }
  };

  // Get selected invitations for analysis
  const selectedInvitations = spaceDetails?.invites?.filter(inv => selectedIds.includes(inv.id)) || [];

  // Calculate counts for UI display
  const pendingLinkCount = selectedInvitations.filter(
    inv => inv.status === "pending" && inv.type === "link"
  ).length;

  const pendingCount = selectedInvitations.filter(inv => inv.status === "pending").length;
  const approvedCount = selectedInvitations.filter(inv => inv.status === "approved").length;
  const emailCount = selectedInvitations.filter(inv => inv.type === "email").length;
  const linkCount = selectedInvitations.filter(inv => inv.type === "link").length;

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bricogrotesque">
              Pending Invitations
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage email and link invitations ({counts?.all} total)
            </p>
          </div>
          <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
          <InviteMembersModal
            open={open}
            onOpenChange={setOpen}
            spaceDetails={spaceDetails || null}
            setSpaceDetails={setSpaceDetails}
          />
        </div>
      </CardHeader>

      {/* Filter Bar */}
      <div className="px-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="h-8 px-3"
            >
              All
              <Badge variant="secondary" className="ml-2">
                {counts?.all}
              </Badge>
            </Button>
            <Button
              variant={filter === "email" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("email")}
              className="h-8 px-3"
            >
              <Mail className="h-3.5 w-3.5 mr-2" />
              Email
              <Badge variant="secondary" className="ml-2">
                {counts?.email}
              </Badge>
            </Button>
            <Button
              variant={filter === "link" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("link")}
              className="h-8 px-3"
            >
              <LinkIcon className="h-3.5 w-3.5 mr-2" />
              Link
              <Badge variant="secondary" className="ml-2">
                {counts?.link}
              </Badge>
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
              className="h-8 px-3"
            >
              <Clock className="h-3.5 w-3.5 mr-2" />
              Pending
              <Badge variant="secondary" className="ml-2">
                {counts?.pending}
              </Badge>
            </Button>
            <Button
              variant={filter === "approved" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("approved")}
              className="h-8 px-3"
            >
              <CheckCircle className="h-3.5 w-3.5 mr-2" />
              Approved
              <Badge variant="secondary" className="ml-2">
                {counts?.approved}
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <>
          <div className="bg-primary/5 px-6 py-3 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                  className="h-5 w-5"
                />
                <div className="flex flex-col">
                  <span className="font-medium">
                    {selectedIds.length} invitation
                    {selectedIds.length !== 1 ? "s" : ""} selected
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {pendingCount} pending, {approvedCount} approved • {linkCount} link, {emailCount} email
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Only show Accept button if there are pending link invitations */}
                {pendingLinkCount > 0 && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleBulkAccept}
                    disabled={isProcessingBulk}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isProcessingBulk ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Accept Selected ({pendingLinkCount})
                      </>
                    )}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkRemove}
                  disabled={isProcessingBulk}
                  className="border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {isProcessingBulk ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Remove Selected ({selectedIds.length})
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds([])}
                  disabled={isProcessingBulk}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      <CardContent className="p-0">
        {filteredInvitations && filteredInvitations.length > 0 ? (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <div className="min-w-[900px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b">
                <div className="col-span-1 flex items-center">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleSelectAll}
                    className="h-4 w-4"
                    disabled={filteredInvitations.length === 0}
                  />
                </div>
                <div className="col-span-3 text-sm font-semibold">
                  Email Address
                </div>
                <div className="col-span-2 text-sm font-semibold">
                  Invitation Type
                </div>
                <div className="col-span-2 text-sm font-semibold">Invited</div>
                <div className="col-span-2 text-sm font-semibold">Status</div>
                <div className="col-span-2 text-sm font-semibold text-right">
                  Actions
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {filteredInvitations.map((invitation) => {
                  const isAcceptLoading = loadingStates[invitation.id]?.accept || false;
                  const isRemoveLoading = loadingStates[invitation.id]?.remove || false;
                  const isInvitationProcessing = isAcceptLoading || isRemoveLoading;

                  return (
                    <div
                      key={invitation.id}
                      className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/50 transition-colors"
                    >
                      {/* Checkbox */}
                      <div className="col-span-1 flex items-center">
                        <Checkbox
                          checked={selectedIds.includes(invitation.id)}
                          onCheckedChange={() => toggleSelect(invitation.id)}
                          className="h-4 w-4"
                          disabled={isInvitationProcessing || isProcessingBulk}
                        />
                      </div>

                      {/* Email - Fixed overflow */}
                      <div className="col-span-3 flex items-center min-w-0">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`p-2 rounded-lg flex-shrink-0 ${invitation.type === "email"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-blue-100 text-blue-600"
                              }`}
                          >
                            {invitation.type === "email" ? (
                              <Mail className="h-4 w-4" />
                            ) : (
                              <LinkIcon className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate text-sm">
                              {invitation.email}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {invitation.type === "email"
                                ? "Email invitation"
                                : "Link invitation"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Invitation Type */}
                      <div className="col-span-2 flex items-center">
                        <Badge
                          variant="outline"
                          className={
                            invitation.type === "email"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }
                        >
                          {invitation.type === "email" ? (
                            <>
                              <Mail className="h-3 w-3 mr-1.5" />
                              Email
                            </>
                          ) : (
                            <>
                              <LinkIcon className="h-3 w-3 mr-1.5" />
                              Link
                            </>
                          )}
                        </Badge>
                      </div>

                      {/* Invited Date */}
                      <div className="col-span-2 flex items-center">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground truncate">
                            {formatRelativeTime(invitation.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-2 flex items-center">
                        <Badge
                          variant={
                            invitation.status === "approved"
                              ? "default"
                              : "outline"
                          }
                          className={
                            invitation.status === "approved"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }
                        >
                          {invitation.status === "approved" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1.5" />
                              Approved
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1.5" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </div>

                      {/* Actions - Desktop */}
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        {/* Desktop Actions */}
                        <div className="hidden sm:flex gap-2">
                          {invitation.status === "pending" ? (
                            <>
                              {invitation.type === "link" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleAcceptInvitation(invitation)}
                                  disabled={isInvitationProcessing || isProcessingBulk}
                                  className="bg-green-600 hover:bg-green-700 h-8 min-w-[85px]"
                                >
                                  {isAcceptLoading ? (
                                    <>
                                      <div className="h-3.5 w-3.5 mr-1.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                      Accepting...
                                    </>
                                  ) : (
                                    <>
                                      <Check className="h-3.5 w-3.5 mr-1.5" />
                                      Accept
                                    </>
                                  )}
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoveInvitation(invitation)}
                                disabled={isInvitationProcessing || isProcessingBulk}
                                className="border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 h-8 min-w-[85px]"
                              >
                                {isRemoveLoading ? (
                                  <>
                                    <div className="h-3.5 w-3.5 mr-1.5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                    Removing...
                                  </>
                                ) : (
                                  <>
                                    <X className="h-3.5 w-3.5 mr-1.5" />
                                    Remove
                                  </>
                                )}
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveInvitation(invitation)}
                              disabled={isInvitationProcessing || isProcessingBulk}
                              className="border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 h-8 min-w-[85px]"
                            >
                              {isRemoveLoading ? (
                                <>
                                  <div className="h-3.5 w-3.5 mr-1.5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                  Removing...
                                </>
                              ) : (
                                <>
                                  <X className="h-3.5 w-3.5 mr-1.5" />
                                  Remove
                                </>
                              )}
                            </Button>
                          )}
                        </div>

                        {/* Mobile Actions Dropdown */}
                        <div className="sm:hidden">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                disabled={isInvitationProcessing || isProcessingBulk}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {invitation.status === "pending" &&
                                invitation.type === "link" && (
                                  <DropdownMenuItem
                                    onClick={() => handleAcceptInvitation(invitation)}
                                    className="text-green-600"
                                    disabled={isInvitationProcessing}
                                  >
                                    {isAcceptLoading ? (
                                      <>
                                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                                        Accepting...
                                      </>
                                    ) : (
                                      <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Accept Invitation
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                )}
                              <DropdownMenuItem
                                onClick={() => handleRemoveInvitation(invitation)}
                                className="text-red-600"
                                disabled={isInvitationProcessing}
                              >
                                {isRemoveLoading ? (
                                  <>
                                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                    Removing...
                                  </>
                                ) : (
                                  <>
                                    <X className="h-4 w-4 mr-2" />
                                    Remove Invitation
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="rounded-full bg-muted p-6 mb-6">
              {filter === "email" ? (
                <Mail className="h-16 w-16 text-muted-foreground/50" />
              ) : filter === "link" ? (
                <LinkIcon className="h-16 w-16 text-muted-foreground/50" />
              ) : filter === "pending" ? (
                <Clock className="h-16 w-16 text-muted-foreground/50" />
              ) : filter === "approved" ? (
                <CheckCircle className="h-16 w-16 text-muted-foreground/50" />
              ) : (
                <UserPlus className="h-16 w-16 text-muted-foreground/50" />
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2 font-bricogrotesque">
              No {filter !== "all" ? filter : ""} invitations found
            </h3>
            <p className="text-muted-foreground text-center mb-8 max-w-md">
              {filter === "all"
                ? "No invitations available. Send new invites to get started."
                : filter === "pending"
                  ? "No pending invitations. All invitations have been approved."
                  : filter === "approved"
                    ? "No approved invitations yet. Accept pending invitations first."
                    : `No ${filter} invitations found. Try sending a new ${filter} invitation.`}
            </p>
            <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default InvitationsTab;