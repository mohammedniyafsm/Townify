import { Separator } from "@radix-ui/react-select";
import { Card, CardContent, CardHeader } from "../ui/card";



function SpaceInfoShimmer() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Card Title Shimmer */}
          <div className="h-6 w-40 bg-muted rounded animate-pulse"></div>
          
          {/* Action Buttons Shimmer */}
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Space Name Input Shimmer */}
        <div className="space-y-3">
          <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
          <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
        </div>

        {/* Invite Link Shimmer */}
        <div className="space-y-3">
          <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-10 flex-1 bg-muted rounded animate-pulse"></div>
            <div className="h-10 w-12 bg-muted rounded animate-pulse"></div>
          </div>
        </div>

        <Separator />

        {/* Map Image Section Shimmer */}
        <div className="space-y-3">
          <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
          <div className="space-y-4">
            <div className="relative">
              <div className="w-full max-w-2xl md:max-w-xl lg:max-w-xl xl:max-w-2xl h-48 md:h-56 lg:h-64 bg-muted rounded-lg mx-auto animate-pulse"></div>
            </div>
            
            {/* Upload Button Shimmer (if editing) */}
            <div className="space-y-3">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
                  <div className="space-y-2 w-full max-w-sm">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse mx-auto"></div>
                    <div className="h-3 w-48 bg-muted rounded animate-pulse mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SpaceInfoShimmer;