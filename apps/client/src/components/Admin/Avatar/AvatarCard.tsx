import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AvatarSchema } from "@repo/types";

// Avatar Card Component
interface AvatarCardProps {
  avatar: AvatarSchema;
  onDelete: () => void;
  onEdit: () => void;
}

function AvatarCard({ avatar, onEdit, onDelete }: AvatarCardProps) {
  return (
    <Card className="overflow-hidden border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group">
      {/* 3:4 Aspect Ratio Container for Game Character */}
      <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 relative">
        <img
          src={avatar?.idle}
          alt={avatar?.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
      </div>

      {/* Card Content - Reduced padding for 5 columns */}
      <CardContent className="p-3">
        <h3 className="font-medium text-gray-900 truncate text-sm mb-2">
          {avatar?.name}
        </h3>

        {/* Action Buttons - Smaller for 5 columns */}
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-7 px-2 border-gray-300 hover:bg-gray-50"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 text-xs h-7 px-2"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


export default AvatarCard;