import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import type { SpaceI } from "@repo/types";
import { Copy, Edit, Save } from "lucide-react";
import { Separator } from "@radix-ui/react-select";
import { updateSpace } from "@/api/SpaceApi";
import { toast } from "sonner";
import { editUserSpace } from "@/Redux/Slice/UserSpace/UserSpaceSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/Redux/stroe";

function EditSpace({
  spaceDetails,
  setSpaceDetails,
}: {
  spaceDetails: SpaceI | null;
  setSpaceDetails: React.Dispatch<React.SetStateAction<SpaceI | null>>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [spaceName, setSpaceName] = useState(spaceDetails?.name || "");
  const dispatch = useDispatch<AppDispatch>();

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/join/${spaceDetails?.slug}`;
    navigator.clipboard.writeText(inviteLink);
  };

  const handleSaveChanges = async () => {
    try {
      setIsEditing(false);
      setSaving(true);
      const response = await updateSpace(
        spaceDetails?.id || "",
        spaceName,
        spaceDetails?.map?.id || ""
      );
      dispatch(editUserSpace({name:spaceName,id:spaceDetails?.id||''}));
      setSpaceDetails(response.data.space);
      setSpaceName(response.data.space.name);
      setSaving(false);
      toast.success("Space details updated successfully", { duration: 1000 });
    } catch (error) {
      setSaving(false);
      toast.error("Failed to save changes", { duration: 1500 });
      console.error("Error saving changes:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Space Information</CardTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => {
              setIsEditing(false)
                setSpaceName(spaceDetails?.name||'');
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                {saving ? (
                  <Button disabled>Saving...</Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="space-name">Space Name</Label>
          <Input
            id="space-name"
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
            placeholder="Enter space name"
            disabled={!isEditing}
            className="w-full"
          />
        </div>
        <div className="">
          <Label>Invite Link</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={`${window.location.origin}/join/${spaceDetails?.slug}`}
              readOnly
              className="flex-1"
            />
            <Button variant="outline" onClick={handleCopyInviteLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Separator />

        <div className="space-y-3">
          <Label>Map Image</Label>
          <div className="space-y-4">
            <div className="relative">
              <img
                src={spaceDetails?.map?.thumbnail}
                alt="Space map"
                className="w-full max-w-2xl md:max-w-xl lg:max-w-xl xl:max-w-2xl h-48 md:h-56 lg:h-64 object-cover rounded-lg border shadow-sm mx-auto"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default EditSpace;
