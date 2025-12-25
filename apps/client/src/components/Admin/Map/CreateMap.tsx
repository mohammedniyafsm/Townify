import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MapForm from "./MapForm";

interface MapFormData {
  name: string;
  thumbnail: File | null | string; // File for new upload, string for existing URL
  mapJson: File | null | string; // File for new upload, string for existing filename
}



// Create Map Modal Component
interface CreateMapModalProps {
  onCreate: (data: MapFormData) => void;
  isSubmitting?: boolean;
}

function CreateMapModal({ onCreate, isSubmitting }: CreateMapModalProps) {
  return (
    <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Map</DialogTitle>
      </DialogHeader>
      <MapForm onSubmit={onCreate} isSubmitting={isSubmitting} mode="create" />
    </DialogContent>
  );
}

export default CreateMapModal;