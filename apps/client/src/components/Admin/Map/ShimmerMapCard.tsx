import { Card, CardContent } from "@/components/ui/card";

function ShimmerMapCard() {
  return (
    <Card
      className="overflow-hidden border border-gray-200 animate-pulse"
      aria-label="Loading map card..."
      role="status"
      aria-live="polite"
    >
      {/* Image Container - aspect-video with shimmer */}
      <div className="aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative">
        {/* Simulated hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
      </div>

      {/* Card Content - Exact match */}
      <CardContent className="p-4">
        {/* Map name shimmer */}
        <div className="mb-2">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* JSON filename shimmer (conditional) - always shows in shimmer */}
        <div className="mb-3">
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Action Buttons - Same layout */}
        <div className="flex gap-2">
          <div
            className="flex-1 h-9 bg-gray-200 rounded"
            aria-hidden="true"
          ></div>
          <div
            className="flex-1 h-9 bg-gray-200 rounded"
            aria-hidden="true"
          ></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ShimmerMapCard;