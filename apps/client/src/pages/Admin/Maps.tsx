import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux/stroe";
import type { MapSchema } from "@repo/types";
import { deleteMap, updateMap, uploadMap } from "@/Redux/Slice/Maps/MapThunk";
import MapCard from "../../components/Admin/Map/MapCard";
import EditMapModal from "../../components/Admin/Map/EditMapForm";
import CreateMapModal from "../../components/Admin/Map/CreateMap";
import ShimmerMapCard from "../../components/Admin/Map/ShimmerMapCard";

interface MapFormData {
  name: string;
  thumbnail: File | null | string; // File for new upload, string for existing URL
  mapJson: File | null | string; // File for new upload, string for existing filename
}

// Main Maps Component
function Maps() {
  const [searchQuery, setSearchQuery] = useState("");
  const map = useSelector((state: RootState) => state.maps);
  const user = useSelector((state: RootState) => state.user);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingMap, setEditingMap] = useState<MapSchema | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const [isPending, startTransition] = useTransition();
  const [filteredMaps, setFilteredMaps] = useState<MapSchema[]>([]);
  const [open, setOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    startTransition(() => {
      setSearchQuery(value);
    });
  };
  useEffect(() => {
    const list = map?.maps ?? [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredMaps(list);
      return;
    }
    const filtered = list.filter((av) => {
      const name = (av as any)?.name ?? "";
      return name.toLowerCase().includes(q);
    });
    setFilteredMaps(filtered);
  }, [map.maps, searchQuery]);

  const handleDelete = async (id: string) => {
    console.log("Deleting map:", id);
    await dispatch(deleteMap(id));
  };

  const handleCreateMap = async (data: MapFormData) => {
    try {
      setIsCreating(true);
      console.log("Creating map:", data);
      const fomData = new FormData();
      fomData.append("name", data.name);
      if (data.thumbnail instanceof File) {
        fomData.append("thumbnail", data.thumbnail);
      }
      if (data.mapJson instanceof File) {
        fomData.append("mapJson", data.mapJson);
      }
      await dispatch(uploadMap(fomData)).unwrap();
      setOpen(false);
    } catch (error) {
      console.error("Error creating map:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateMap = async (data: MapFormData) => {
    if (!editingMap) return;

    try {
      setIsEditing(editingMap.id);
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.thumbnail instanceof File) {
        formData.append("thumbnail", data.thumbnail);
      }
      if (data.mapJson instanceof File) {
        formData.append("mapJson", data.mapJson);
      }
      await dispatch(updateMap({ id: editingMap.id, data: formData })).unwrap();
    } catch (error) {
    } finally {
      setIsEditing(null);
      setEditingMap(null);
    }
  };

  const openEditModal = (map: MapSchema) => {
    setEditingMap(map);
  };

  return (
    <div className="min-h-screen w-full from-white to-emerald-50/20 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Maps
        </h1>
        <p className="text-gray-600">
          Manage your virtual spaces and environments
        </p>
      </div>

      {/* Search and Create Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search maps..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 w-full"
          />
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New Map
            </Button>
          </DialogTrigger>
          <CreateMapModal
            onCreate={handleCreateMap}
            isSubmitting={isCreating}
          />
        </Dialog>
      </div>

      {map.status === "loading" || isPending || user.status === "loading" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ShimmerMapCard key={`shimmer-map-${index}`} />
          ))}
        </div>
      ) : filteredMaps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMaps.map((map) => (
            <MapCard
              key={map.id}
              map={map}
              onDelete={() => handleDelete(map.id)}
              onEdit={() => openEditModal(map)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">No maps found</div>
          <p className="text-gray-500">
            Try a different search or create your first map
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {editingMap && (
        <Dialog open={!!editingMap} onOpenChange={() => setEditingMap(null)}>
          <DialogContent className="sm:max-w-[550px]">
            <EditMapModal
              map={editingMap}
              onUpdate={handleUpdateMap}
              isSubmitting={isEditing === editingMap.id}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}


export default Maps;
