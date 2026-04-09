import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { MapSchemaI } from "@repo/types";
import { useState } from "react";

// Map Card Component
interface MapCardProps {
  map: MapSchemaI;
  onDelete: () => void;
  onEdit: () => void;
  isDeleting?: boolean;
  isEditing?: boolean;
}

function MapCard({ map, onDelete, onEdit, isDeleting = false, isEditing = false }: MapCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="overflow-hidden border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className={`aspect-video overflow-hidden bg-gray-100 relative ${isDeleting || isEditing ? 'opacity-75' : ''}`}>
        <img
          src={map.thumbnail}
          alt={map.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 transition-opacity duration-300" />
        )}
      </div>

      {/* Card Content */}
      <CardContent className="p-4">
        <h3 className={`font-semibold text-gray-900 truncate mb-2 ${isDeleting || isEditing ? 'opacity-75' : ''}`}>
          {map.name}
        </h3>
        {map.configJson && (
          <p className={`text-xs text-gray-500 mb-3 truncate ${isDeleting || isEditing ? 'opacity-75' : ''}`}>
            {map.name + ".json"}
          </p>
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
                disabled={isDeleting || isEditing}
              >
                {isEditing ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Editing...
                  </>
                ) : (
                  "Edit"
                )}
              </Button>
            </DialogTrigger>
          </Dialog>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={onDelete}
            disabled={isDeleting || isEditing}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default MapCard;