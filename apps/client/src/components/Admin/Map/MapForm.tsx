import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { FileJson, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

interface MapFormData {
  name: string;
  thumbnail: File | null | string; // File for new upload, string for existing URL
  mapJson: File | null | string; // File for new upload, string for existing filename
}

interface MapFormProps {
  initialData?: Partial<MapFormData>;
  onSubmit: (data: MapFormData) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

function MapForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  mode = "create",
}: MapFormProps) {
  const [formData, setFormData] = useState<MapFormData>({
    name: initialData?.name || "",
    thumbnail: initialData?.thumbnail || null,
    mapJson: initialData?.mapJson || null,
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  useEffect(() => {
    if (formData.thumbnail instanceof File) {
      const url = URL.createObjectURL(formData.thumbnail);
      setThumbnailPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof formData.thumbnail === "string") {
      setThumbnailPreview(formData.thumbnail);
    } else {
      setThumbnailPreview("");
    }
  }, [formData.thumbnail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileChange = (
    field: "thumbnail" | "mapJson",
    file: File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleRemoveFile = (field: "thumbnail" | "mapJson") => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Map Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter map name"
          required
        />
      </div>

      {/* Thumbnail Upload */}
      <div className="space-y-2">
        <Label>Thumbnail Image {mode === "create" ? "*" : ""}</Label>

        {thumbnailPreview ? (
          <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
            <div className="relative">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-24 h-24 object-cover rounded-md"
              />
              {formData.thumbnail instanceof File && (
                <button
                  type="button"
                  onClick={() => handleRemoveFile("thumbnail")}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">
                {formData.thumbnail instanceof File
                  ? formData.thumbnail.name
                  : "Existing thumbnail"}
              </p>
              <div className="text-sm">
                <Label htmlFor="thumbnail-upload" className="cursor-pointer">
                  <div className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
                    <Upload className="h-4 w-4" />
                    {formData.thumbnail instanceof File
                      ? "Replace"
                      : "Upload New"}
                  </div>
                  <Input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) handleFileChange("thumbnail", file);
                    }}
                  />
                </Label>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg px-6 py-2 text-center">
            <Upload className="h-6 w-7 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">Upload thumbnail image</p>
            <Label htmlFor="thumbnail-upload" className="cursor-pointer">
              <div className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
                Click to upload
              </div>
              <Input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) handleFileChange("thumbnail", file);
                }}
                required={mode === "create"}
              />
            </Label>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Map JSON File {mode === "create" ? "*" : ""}</Label>

        {formData.mapJson ? (
          <div className="flex items-center justify-between py-2 px-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <FileJson className="h-7 w-7 text-blue-500" />
              <div>
                <p className="font-medium">
                  {formData.mapJson instanceof File
                    ? formData.mapJson.name
                    : typeof formData.mapJson === "string"
                      ? formData.mapJson
                      : "map.json"}
                </p>
                <p className="text-sm text-gray-500">
                  {formData.mapJson instanceof File
                    ? `${(formData.mapJson.size / 1024).toFixed(2)} KB`
                    : "Existing file"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {formData.mapJson instanceof File && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile("mapJson")}
                >
                  Remove
                </Button>
              )}
              {/* FIX: Add ref and click handler */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("json-upload")?.click()}
              >
                {formData.mapJson instanceof File ? "Replace" : "Upload New"}
              </Button>
              <Input
                id="json-upload"
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) handleFileChange("mapJson", file);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg px-6 py-2  text-center">
            <FileJson className="h-8 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">Upload map configuration JSON</p>
            {/* FIX: Also fix the create mode */}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                document.getElementById("json-upload-create")?.click()
              }
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              Click to upload .json file
            </Button>
            <Input
              id="json-upload-create"
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file) handleFileChange("mapJson", file);
              }}
              required={mode === "create"}
            />
          </div>
        )}
      </div>

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
            (mode === "create" && !formData.thumbnail) ||
            (mode === "create" && !formData.mapJson)
          }
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create Map"
              : "Update Map"}
        </Button>
      </div>
    </form>
  );
}

export default MapForm;