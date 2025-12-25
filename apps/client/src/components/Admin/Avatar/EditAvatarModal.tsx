import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AvatarSchema } from "@repo/types";
import AvatarForm from "./AvatarForm";


interface AvatarFormData {
  name: string;
  idleImage: File | null | string;
  walkSheet: File | null | string;
}

interface EditAvatarModalProps {
  avatar: AvatarSchema;
  onUpdate: (data: AvatarFormData) => void;
  isSubmitting?: boolean;
}

function EditAvatarModal({
  avatar,
  onUpdate,
  isSubmitting,
}: EditAvatarModalProps) {
  const initialData: AvatarFormData = {
    name: avatar.name,
    idleImage: avatar.idle,
    walkSheet: avatar.walkSheet,
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Avatar: {avatar.name}</DialogTitle>
      </DialogHeader>
      <AvatarForm
        initialData={initialData}
        onSubmit={onUpdate}
        isSubmitting={isSubmitting}
        mode="edit"
      />
    </>
  );
}


export default EditAvatarModal;