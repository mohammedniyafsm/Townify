import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux/stroe";
import type { AvatarSchema } from "@repo/types";
import ShimmerCard from "../../components/Admin/Avatar/ShimmerCard";
import AvatarCard from "../../components/Admin/Avatar/AvatarCard";
import AvatarForm from "../../components/Admin/Avatar/AvatarForm";
import EditAvatarModal from "../../components/Admin/Avatar/EditAvatarModal";
import { deleteAvatar, updateAvatar, uploadAvatar } from "@/Redux/Slice/Avatars/AvatarThunk";

interface AvatarFormData {
  name: string;
  idleImage: File | null | string;
  walkSheet: File | null | string;
}

// Main Avatars Component
function Avatar() {
  const [searchQuery, setSearchQuery] = useState("");
  const avatar = useSelector((state: RootState) => state.avatars);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [isPending,startTransition]=useTransition()
  const [filteredAvatars , setFilteredAvatars] = useState<AvatarSchema[]>([]);
  const [open,setOpen]=useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    startTransition(()=>{
      setSearchQuery(value);
    })
  }
  useEffect(() => {
    const list = avatar?.avatars ?? [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredAvatars(list);
      return;
    }
    const filtered = list.filter((av) => {
      const name = (av as any)?.name ?? "";
      return name.toLowerCase().includes(q);
    });
    setFilteredAvatars(filtered);
  }, [avatar.avatars, searchQuery]);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingAvatar, setEditingAvatar] = useState<AvatarSchema | null>(null);

  const handleDelete = async (id: string) => {
    console.log("Deleting avatar:", id);
    await dispatch(deleteAvatar(id));
  };

  const handleCreateAvatar = async (data: AvatarFormData) => {
    try {
       console.log("Creating avatar:", data);
    setIsCreating(true);
    const fomData = new FormData();
    fomData.append("name", data.name);  
    if (data.idleImage instanceof File) {
      fomData.append("idle", data.idleImage);
    }
    if (data.walkSheet instanceof File) {
      fomData.append("walkSheet", data.walkSheet);
    }
    await dispatch(uploadAvatar(fomData)).unwrap()
    setOpen(false);
    } catch (error: any) {
      console.error("Error creating avatar:", error);
    }
    finally{
      setIsCreating(false);
    }
  };

  const handleUpdateAvatar = async (data: AvatarFormData) => {
    if (!editingAvatar) return;
    setIsEditing(editingAvatar.id);

    const fomData = new FormData();
    fomData.append("name", data.name);  
    if (data.idleImage instanceof File) {
      fomData.append("idle", data.idleImage);
    }
    if (data.walkSheet instanceof File) {
      fomData.append("walkSheet", data.walkSheet);
    }
    await dispatch(updateAvatar({id: editingAvatar.id,data: fomData}));
    setEditingAvatar(null);
    setIsEditing(null);
  };

  const openEditModal = (avatar: AvatarSchema) => {
    setEditingAvatar(avatar);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-indigo-50/20 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          Avatars
        </h1>
        <p className="text-gray-600">Manage game character avatars</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search avatars..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 w-full"
          />
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={()=>setOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Avatar
            </Button>
          </DialogTrigger>
          <CreateAvatarModal
            onCreate={handleCreateAvatar}
            isSubmitting={isCreating}
          />
        </Dialog>
      </div>
      {avatar.status === "loading" || user.status === "loading"||isPending ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <ShimmerCard key={`shimmer-${index}`} />
          ))}
        </div>
      ) : filteredAvatars.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {filteredAvatars.map((avatar) => (
            <AvatarCard
              key={avatar?.id}
              avatar={avatar}
              onDelete={() => handleDelete(avatar?.id)}
              onEdit={() => openEditModal(avatar)}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {editingAvatar && (
        <Dialog
          open={!!editingAvatar}
          onOpenChange={() => setEditingAvatar(null)}
        >
          <DialogContent className="sm:max-w-[500px]">
            <EditAvatarModal
              avatar={editingAvatar}
              onUpdate={handleUpdateAvatar}
              isSubmitting={isEditing === editingAvatar.id}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Create Avatar Modal
interface CreateAvatarModalProps {
  onCreate: (data: AvatarFormData) => void;
  isSubmitting?: boolean;
}

function CreateAvatarModal({ onCreate, isSubmitting }: CreateAvatarModalProps) {
  return (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Avatar</DialogTitle>
      </DialogHeader>
      <AvatarForm
        onSubmit={onCreate}
        isSubmitting={isSubmitting}
        mode="create"
      />
    </DialogContent>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-3">No avatars found</div>
      <p className="text-gray-500">
        Try a different search or create your first avatar
      </p>
    </div>
  );
}

export default Avatar;
