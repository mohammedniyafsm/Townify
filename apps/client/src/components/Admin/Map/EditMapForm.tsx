import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MapForm from "./MapForm";
import type { MapSchemaI } from "@repo/types";


interface MapFormData {
  name: string;
  thumbnail: File | null | string; // File for new upload, string for existing URL
  mapJson: File | null | string; // File for new upload, string for existing filename
}

interface EditMapModalProps {
  map: MapSchemaI;
  onUpdate: (data: MapFormData) => void;
  isSubmitting?: boolean;
}

function EditMapModal({ map, onUpdate, isSubmitting }: EditMapModalProps) {
  const initialData: MapFormData = {
    name: map.name,
    thumbnail: map.thumbnail,
    mapJson: map.name + ".json" || "map-config.json",
  };

  return (
    <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Map: {map.name}</DialogTitle>
      </DialogHeader>
      <MapForm
        initialData={initialData}
        onSubmit={onUpdate}
        isSubmitting={isSubmitting}
        mode="edit"
      />
    </DialogContent>
  );
}
export default EditMapModal;