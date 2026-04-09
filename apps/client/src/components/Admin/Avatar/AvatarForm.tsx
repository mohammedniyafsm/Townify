import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { FileImage, Grid3x3, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AvatarFormData {
  name: string;
  idleImage: File | null | string;
  walkSheet: File | null | string;
}

interface AvatarFormProps {
  initialData?: Partial<AvatarFormData>;
  onSubmit: (data: AvatarFormData) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

// Shared AvatarForm Component
function AvatarForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  mode = "create",
}: AvatarFormProps) {
  const [formData, setFormData] = useState<AvatarFormData>({
    name: initialData?.name || "",
    idleImage: initialData?.idleImage || null,
    walkSheet: initialData?.walkSheet || null,
  });

  const idleFileInputRef = useRef<HTMLInputElement>(null);
  const walkFileInputRef = useRef<HTMLInputElement>(null);

  const idlePreviewUrlRef = useRef<string | null>(null);
  const [idlePreview, setIdlePreview] = useState<string>(
    typeof initialData?.idleImage === "string" ? initialData.idleImage : ""
  );

  // Cleanup created object URLs on unmount
  useEffect(() => {
    return () => {
      if (idlePreviewUrlRef.current) {
        try {
          URL.revokeObjectURL(idlePreviewUrlRef.current);
        } catch (e) {
          // ignore
        }
        idlePreviewUrlRef.current = null;
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileChange = (
    field: "idleImage" | "walkSheet",
    file: File | null
  ) => {
    console.log("File selected for", field, ":", file?.name || "none");
    setFormData((prev) => ({ ...prev, [field]: file }));

    if (field === "idleImage" && file) {
      // Revoke previous preview URL if any
      if (idlePreviewUrlRef.current) {
        try {
          URL.revokeObjectURL(idlePreviewUrlRef.current);
        } catch (e) {
          // ignore
        }
        idlePreviewUrlRef.current = null;
      }
      const url = URL.createObjectURL(file);
      idlePreviewUrlRef.current = url;
      setIdlePreview(url);
    }
  };

  const handleRemoveFile = (field: "idleImage" | "walkSheet") => {
    console.log("Removing file from", field);
    setFormData((prev) => ({ ...prev, [field]: null }));
    if (field === "idleImage") {
      // Clear preview and revoke object URL
      if (idlePreviewUrlRef.current) {
        try {
          URL.revokeObjectURL(idlePreviewUrlRef.current);
        } catch (e) {
          // ignore
        }
        idlePreviewUrlRef.current = null;
      }
      setIdlePreview("");
      // Clear the native input so selecting the same file later will fire onChange
      if (idleFileInputRef.current) idleFileInputRef.current.value = "";
    }
    if (field === "walkSheet") {
      if (walkFileInputRef.current) walkFileInputRef.current.value = "";
    }
  };

  const triggerFileInput = (field: "idle" | "walk") => {
    if (field === "idle" && idleFileInputRef.current) {
      idleFileInputRef.current.click();
    } else if (field === "walk" && walkFileInputRef.current) {
      walkFileInputRef.current.click();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Avatar Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter avatar name"
          required
        />
      </div>

      {/* Idle Image Upload - Preview Inside Input */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <FileImage className="h-4 w-4" />
          Idle Sprite {mode === "create" ? "*" : ""}
        </Label>

        <div className="border-2 border-dashed border-blue-300 rounded-lg overflow-hidden hover:border-blue-400 transition-colors">
          {idlePreview || formData.idleImage instanceof File ? (
            <div className="px-4 py-2 bg-blue-50">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-blue-200 flex-shrink-0">
                  {idlePreview ? (
                    <img
                      src={idlePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : formData.idleImage instanceof File ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                      <FileImage className="h-6 w-6 text-blue-400" />
                    </div>
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {formData.idleImage instanceof File
                      ? formData.idleImage.name
                      : typeof formData.idleImage === "string"
                        ? "Current idle sprite"
                        : "No file selected"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={() => triggerFileInput("idle")}
                    >
                      {formData.idleImage instanceof File
                        ? "Replace"
                        : "Upload"}
                    </Button>
                    {(formData.idleImage instanceof File ||
                      mode === "edit") && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-gray-600 hover:text-gray-900"
                        onClick={() => handleRemoveFile("idleImage")}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="px-8 py-3 text-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
              onClick={() => triggerFileInput("idle")}
            >
              <Upload className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-gray-700 font-medium">Upload idle sprite</p>
              <p className="text-sm text-gray-500 mt-1">
                Single character image for idle state
              </p>
            </div>
          )}

          <Input
            ref={idleFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              handleFileChange("idleImage", file);
            }}
            required={mode === "create"}
          />
        </div>
      </div>

      {/* Walk Sheet Upload - No Preview, Just Filename */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Grid3x3 className="h-4 w-4" />
          Walk Animation Sheet {mode === "create" ? "*" : ""}
        </Label>

        <div className="border-2 border-dashed border-purple-300 rounded-lg overflow-hidden hover:border-purple-400 transition-colors">
          {formData.walkSheet ? (
            <div className="p-4 bg-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Grid3x3 className="h-5 w-5 text-purple-500" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {formData.walkSheet instanceof File
                        ? formData.walkSheet.name
                        : typeof formData.walkSheet === "string"
                          ? formData.name +
                            formData.walkSheet.slice(
                              formData.walkSheet.lastIndexOf(".")
                            )
                          : "walk_sheet.png"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formData.walkSheet instanceof File
                        ? `${(formData.walkSheet.size / 1024).toFixed(1)} KB`
                        : "Sprite sheet file"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs border-purple-300 text-purple-700 hover:bg-purple-50"
                    onClick={() => triggerFileInput("walk")}
                  >
                    {formData.walkSheet instanceof File
                      ? "Replace"
                      : "Upload New"}
                  </Button>
                  {formData.walkSheet instanceof File && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-gray-600 hover:text-gray-900"
                      onClick={() => handleRemoveFile("walkSheet")}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="px-8 py-3 text-center cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors"
              onClick={() => triggerFileInput("walk")}
            >
              <Upload className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-gray-700 font-medium">
                Upload walk sprite sheet
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Animation sheet with walking frames
              </p>
            </div>
          )}

          <Input
            ref={walkFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              handleFileChange("walkSheet", file);
            }}
            required={mode === "create"}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <DialogTrigger asChild>
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
        </DialogTrigger>
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !formData.name ||
            (mode === "create" && !formData.idleImage) ||
            (mode === "create" && !formData.walkSheet)
          }
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create Avatar"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}


export default AvatarForm;