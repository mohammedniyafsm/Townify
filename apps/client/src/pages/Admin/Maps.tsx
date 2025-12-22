import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, X, Upload, FileJson } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Types
interface MapItem {
  id: number;
  title: string;
  imageUrl: string;
  jsonFilename?: string;
}

interface MapFormData {
  name: string;
  thumbnail: File | null | string; // File for new upload, string for existing URL
  mapJson: File | null | string; // File for new upload, string for existing filename
}

interface MapFormProps {
  initialData?: Partial<MapFormData>;
  onSubmit: (data: MapFormData) => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

function MapForm({ initialData, onSubmit, isSubmitting = false, mode = 'create' }: MapFormProps) {
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

  const handleFileChange = (field: "thumbnail" | "mapJson", file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleRemoveFile = (field: "thumbnail" | "mapJson") => {
    setFormData(prev => ({
      ...prev,
      [field]: null
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
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter map name"
          required
        />
      </div>

      {/* Thumbnail Upload */}
      <div className="space-y-2">
        <Label>Thumbnail Image {mode === 'create' ? '*' : ''}</Label>
        
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
                    {formData.thumbnail instanceof File ? "Replace" : "Upload New"}
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
                required={mode === 'create'}
              />
            </Label>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF</p>
          </div>
        )}
      </div>

    <div className="space-y-2">
  <Label>Map JSON File {mode === 'create' ? '*' : ''}</Label>
  
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
          onClick={() => document.getElementById('json-upload')?.click()}
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
        onClick={() => document.getElementById('json-upload-create')?.click()}
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
        required={mode === 'create'}
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
          disabled={isSubmitting || !formData.name || 
            (mode === 'create' && !formData.thumbnail) || 
            (mode === 'create' && !formData.mapJson)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isSubmitting ? "Saving..." : mode === 'create' ? "Create Map" : "Update Map"}
        </Button>
      </div>
    </form>
  );
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
      <MapForm 
        onSubmit={onCreate} 
        isSubmitting={isSubmitting}
        mode="create"
      />
    </DialogContent>
  );
}

// Edit Map Modal Component
interface EditMapModalProps {
  map: MapItem;
  onUpdate: (data: MapFormData) => void;
  isSubmitting?: boolean;
}

function EditMapModal({ map, onUpdate, isSubmitting }: EditMapModalProps) {
  const initialData: MapFormData = {
    name: map.title,
    thumbnail: map.imageUrl,
    mapJson: map.jsonFilename || "map-config.json",
  };

  return (
    <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Map: {map.title}</DialogTitle>
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

// Main Maps Component
function Maps() {
  const [searchQuery, setSearchQuery] = useState("");
  const [maps, setMaps] = useState<MapItem[]>([
    { 
      id: 1, 
      title: "Brideon", 
      imageUrl: "https://th.bing.com/th/id/OIP.uY6d0Ths7T-7IsapPTlviQHaF4?w=233&h=185&c=7&r=0&o=5&pid=1.7",
      jsonFilename: "brideon-map.json"
    },
    { 
      id: 2, 
      title: "Office Space", 
      imageUrl: "https://th.bing.com/th/id/OIP.T8k5_R3DvqHYSxy-6esQ3QHaEK?w=303&h=180&c=7&r=0&o=5&pid=1.7",
      jsonFilename: "office-space.json"
    },
    { 
      id: 3, 
      title: "Conference Hall", 
      imageUrl: "https://th.bing.com/th/id/OIP.OcIUCQG8MXe4G6gC_TtAUwHaE8?w=268&h=180&c=7&r=0&o=5&pid=1.7",
      jsonFilename: "conference-hall.json"
    },
    { 
      id: 4, 
      title: "Game Room", 
      imageUrl: "https://th.bing.com/th/id/OIP.Bt2gUwClRgBR5rrKlLJgFgHaE8?w=272&h=182&c=7&r=0&o=5&pid=1.7",
      jsonFilename: "game-room.json"
    },
    { 
      id: 5, 
      title: "Library", 
      imageUrl: "https://th.bing.com/th/id/OIP.Rqch_4aNpdpm71q2JMYr_wHaE8?w=266&h=180&c=7&r=0&o=5&pid=1.7",
      jsonFilename: "library-map.json"
    },
    { 
      id: 6, 
      title: "Garden", 
      imageUrl: "https://th.bing.com/th/id/OIP.yN6sk2z45l9Xq3AT5VldtwHaE8?w=270&h=180&c=7&r=0&o=5&pid=1.7",
      jsonFilename: "garden.json"
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editingMap, setEditingMap] = useState<MapItem | null>(null);

  const filteredMaps = maps.filter(map =>
    map.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setMaps(prev => prev.filter(map => map.id !== id));
  };

  const handleCreateMap = async (data: MapFormData) => {
    setIsCreating(true);
    
    // Create FormData for backend
    const formData = new FormData();
    formData.append('name', data.name);
    
    if (data.thumbnail instanceof File) {
      formData.append('thumbnail', data.thumbnail);
    }
    
    if (data.mapJson instanceof File) {
      formData.append('mapJson', data.mapJson);
    }
    
    // Your API call would go here
    // const response = await fetch('/api/maps', { method: 'POST', body: formData });
    
    // Mock response for demonstration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add new map to state (in real app, use response data)
    const newMap: MapItem = {
      id: maps.length + 1,
      title: data.name,
      imageUrl: data.thumbnail instanceof File ? URL.createObjectURL(data.thumbnail) : "",
      jsonFilename: data.mapJson instanceof File ? data.mapJson.name : "map.json"
    };
    
    setMaps(prev => [...prev, newMap]);
    setIsCreating(false);
  };

  const handleUpdateMap = async (data: MapFormData) => {
    if (!editingMap) return;
    
    setIsEditing(editingMap.id);
    
    // Create FormData for backend
    const formData = new FormData();
    formData.append('name', data.name);
    
    if (data.thumbnail instanceof File) {
      formData.append('thumbnail', data.thumbnail);
    }
    
    if (data.mapJson instanceof File) {
      formData.append('mapJson', data.mapJson);
    }
    
    // Your API call would go here
    // const response = await fetch(`/api/maps/${editingMap.id}`, { method: 'PUT', body: formData });
    
    // Mock response for demonstration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update map in state (in real app, use response data)
    setMaps(prev => prev.map(map => 
      map.id === editingMap.id 
        ? {
            ...map,
            title: data.name,
            imageUrl: data.thumbnail instanceof File ? URL.createObjectURL(data.thumbnail) : map.imageUrl,
            jsonFilename: data.mapJson instanceof File ? data.mapJson.name : map.jsonFilename
          }
        : map
    ));
    
    setEditingMap(null);
    setIsEditing(null);
  };

  const openEditModal = (map: MapItem) => {
    setEditingMap(map);
  };

  return (
    <div className="min-h-screen w-full from-white to-emerald-50/20 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Maps</h1>
        <p className="text-gray-600">Manage your virtual spaces and environments</p>
      </div>

      {/* Search and Create Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search maps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        
        <Dialog>
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

      {/* Maps Grid */}
      {filteredMaps.length > 0 ? (
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
          <p className="text-gray-500">Try a different search or create your first map</p>
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

// Map Card Component
interface MapCardProps {
  map: MapItem;
  onDelete: () => void;
  onEdit: () => void;
}

function MapCard({ map, onDelete, onEdit }: MapCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="overflow-hidden border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="aspect-video overflow-hidden bg-gray-100 relative">
        <img
          src={map.imageUrl}
          alt={map.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 transition-opacity duration-300" />
        )}
      </div>

      {/* Card Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 truncate mb-2">{map.title}</h3>
        {map.jsonFilename && (
          <p className="text-xs text-gray-500 mb-3 truncate">{map.jsonFilename}</p>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 border-gray-300 hover:bg-gray-50"
                onClick={onEdit}
              >
                Edit
              </Button>
            </DialogTrigger>
          </Dialog>
          <Button 
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default Maps;