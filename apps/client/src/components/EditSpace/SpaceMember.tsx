import { useState } from "react";
import { UserPlus, Users, UserX, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import type { SpaceI } from "@repo/types";
import { toggleMember } from "@/api/SpaceApi";
import { toast } from "sonner";

function SpaceMember({
  spaceDetails,
  setSpaceDetails,
}: {
  spaceDetails: SpaceI | null;
  setSpaceDetails: React.Dispatch<React.SetStateAction<SpaceI | null>>;
}) {
  // 👇 per-member loading state
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const handleToggleMember = async (userId: string, memberId: string) => {
    if (!spaceDetails) return;

    try {
      // set loading for this member only
      setLoadingMap((prev) => ({ ...prev, [memberId]: true }));

      const response = await toggleMember(spaceDetails.slug, userId);

      const updatedMembers = spaceDetails.members?.map((member) =>
        member.id === memberId
          ? { ...member, status: response.data.status }
          : member
      );

      setSpaceDetails({
        ...spaceDetails,
        members: updatedMembers,
      });

      toast.success("Member status updated", { duration: 1000 });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update member",
        { duration: 1500 }
      );
      console.error(error);
    } finally {
      // remove loading for this member
      setLoadingMap((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Space Members ({spaceDetails?.members?.length || 0})
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {spaceDetails?.members?.length ? (
                spaceDetails.members.map((member) => {
                  const isLoading = loadingMap[member.id];

                  return (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={member.user?.profile || ""}
                            />
                            <AvatarFallback>
                              {member.user?.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {member.user?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.user?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <Badge>
                          {spaceDetails.creatorId === member.userId
                            ? "Admin"
                            : "Member"}
                        </Badge>
                      </TableCell>

                      <TableCell className="hidden sm:table-cell">
                        {member.status === "active" ? (
                          <Badge className="bg-green-50 text-green-700 border-green-200">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-red-50 text-red-700 border-red-200">
                            Blocked
                          </Badge>
                        )}
                      </TableCell>

                      {spaceDetails.creatorId !== member.userId && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isLoading}
                            onClick={() =>
                              handleToggleMember(
                                member.user?.id || "",
                                member.id
                              )
                            }
                            className={
                              member.status === "blocked"
                                ? "text-green-600 hover:bg-green-50"
                                : "text-red-600 hover:bg-red-50"
                            }
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : member.status === "blocked" ? (
                              <UserPlus className="h-4 w-4" />
                            ) : (
                              <UserX className="h-4 w-4" />
                            )}

                            <span className="ml-2 hidden sm:inline">
                              {member.status === "blocked"
                                ? "Unblock"
                                : "Block"}
                            </span>
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground mt-2">
                      No members yet
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default SpaceMember;
