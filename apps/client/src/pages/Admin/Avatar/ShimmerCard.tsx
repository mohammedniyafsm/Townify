import { Card, CardContent } from "@/components/ui/card";

function ShimmerCard() {
  return (
    <Card
      className="overflow-hidden border border-gray-200 animate-pulse"
      aria-label="Loading avatar card..."
      role="status"
      aria-live="polite"
    >
      {/* 3:4 Aspect Ratio Container - Exact match */}
      <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative">
        {/* Gradient overlay matching original */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
      </div>

      {/* Card Content - Exact padding and structure */}
      <CardContent className="p-3">
        {/* Title area shimmer */}
        <div className="mb-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          {/* Optional: Add a smaller text line if needed */}
          {/* <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div> */}
        </div>

        {/* Action Buttons - Exact same layout */}
        <div className="flex gap-1.5">
          {/* Edit button shimmer */}
          <div
            className="flex-1 h-7 bg-gray-200 rounded"
            aria-hidden="true"
          ></div>
          {/* Delete button shimmer */}
          <div
            className="flex-1 h-7 bg-gray-200 rounded"
            aria-hidden="true"
          ></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ShimmerCard;