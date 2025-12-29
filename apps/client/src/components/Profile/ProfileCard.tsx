import { useEffect, useState } from "react";
import AllAvatarsModal from "@/components/RoomLobby/AllAvatarsModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil, Gamepad2 } from "lucide-react";
import type { UserI, AvatarI } from "@repo/types";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux/stroe";
import { updateUser } from "@/Redux/Slice/Auth/AuthThunk";
import { toast } from "sonner";
import { BorderBeam } from "../ui/border-beam";

export default function ProfileCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const avatars = useSelector((state: RootState) => state.avatars.avatars);
  const user = useSelector((state: RootState) => state.user);
  const [currentUser, setCurrentUser] = useState<UserI | null>(
    user.user || null
  );
  const [currentAvatar, setCurrentAvatar] = useState<AvatarI | null>(null);
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user.status === "succeeded") {
      setCurrentUser(user.user || null);
      setName(user.user?.name || "");
      setProfile(user.user?.profile || "");
      setCurrentAvatar(user.user?.avatar || null);
    }
  }, [user.status]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (profileImageFile) {
        formData.append("profile", profileImageFile);
      }
      formData.append(
        "avatarId",
        currentAvatar && currentAvatar.id !== currentUser?.avatar?.id
          ? currentAvatar.id
          : ""
      );
    const response = await dispatch(updateUser(formData)).unwrap();
    setCurrentUser(response.user);
    setName(response.user.name);
    setProfile(response.user.profile || "");
    setCurrentAvatar(response.user.avatar || null);
    setProfile(response.user.profile || "");
    setIsEditing(false);
    setIsSaving(false);
    toast.success("Profile updated successfully");
    } catch (error:any) {
        console.error("Error updating profile:", error);
        toast.error(error.message || "Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(currentUser?.name || "");
    setProfile(currentUser?.profile || "");
  };

  const handleProfileImageClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const profileURL = URL.createObjectURL(file);
      setProfile(profileURL);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-md mx-auto mt-0 pt-0 mb-0 p-4">
         <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        linear-gradient(135deg, 
          rgba(248,250,252,1) 0%, 
          rgba(219,234,254,0.7) 30%, 
          rgba(165,180,252,0.5) 60%, 
          rgba(129,140,248,0.6) 100%
        ),
        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(199,210,254,0.4) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(224,231,255,0.3) 0%, transparent 60%)
      `,
          }}
        />
        <div className="relative z-10">
            <BorderBeam></BorderBeam>
      <Card className="p-5 ">
        <div className="text-center mb-1">
          <div className="flex items-center  mb-2">
            <h3 className="text-lg font-semibold">Profile Information</h3>
          </div>
          <div className="relative inline-block">
            <Input
              disabled={!isEditing}
              onChange={handleProfileImageClick}
              type="file"
              hidden
              id="profileImage"
            />
            <Label htmlFor="profileImage">
              <Avatar className="h-24 w-24 border-2 cursor-pointer">
                {profile ? <AvatarImage src={profile} alt={name} /> : null}
                <AvatarFallback className="text-lg bg-muted">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
            </Label>
            {isEditing && (
              <div className="absolute -bottom-1 -right-1 bg-background border rounded-full p-1">
                <Pencil className="h-3 w-3" />
              </div>
            )}
          </div>
          <h1 className="text-xl font-semibold mt-3">{currentUser?.name}</h1>
          <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-2 ">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Full name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              disabled={!isEditing || isSaving}
              className="mt-1"
            />
            {!name.trim() && isEditing && (
              <p className="text-xs text-destructive mt-1">Name is required</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={currentUser?.email}
              disabled
              className="mt-1"
            />
          </div>
        </div>

        <div className="">
          <div className="flex items-center gap-2 mb-0">
            <Gamepad2 className="h-4 w-4" />
            <h3 className="font-medium">Game Avatar</h3>
          </div>

          <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="relative">
              <div
                onClick={() => isEditing && setIsAvatarModalOpen(true)}
                className="cursor-pointer h-16 w-16 rounded overflow-hidden bg-background"
              >
                <img
                  src={currentAvatar?.idle || "/placeholder-avatar.png"}
                  alt={currentAvatar?.name || "No avatar"}
                  className="h-full w-full object-contain"
                />
              </div>
              {isEditing && (
                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer hover:bg-primary/90">
                  <Pencil className="h-2.5 w-2.5" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !name.trim()}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </>
          )}
        </div>

        {/* Avatar Modal */}
        <AllAvatarsModal
          openModal={isAvatarModalOpen}
          setModal={setIsAvatarModalOpen}
          currentAvatar={currentAvatar}
          setCurrentAvatars={setCurrentAvatar}
          avatars={avatars}
        />
      </Card>
      </div>        
    </div>
    );
}