import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileShimmer() {
  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="p-5 relative z-10">
        {/* Header Shimmer */}
        <div className="text-center mb-1">
          <div className="flex items-center justify-between mb-2">
            <div className="h-6 w-40 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="relative inline-block">
            <div className="h-24 w-24 rounded-full bg-muted animate-pulse mx-auto"></div>
          </div>
          <div className="h-7 w-32 bg-muted rounded animate-pulse mx-auto mt-3"></div>
          <div className="h-4 w-48 bg-muted rounded animate-pulse mx-auto mt-2"></div>
        </div>

        {/* Form Fields Shimmer */}
        <div className="space-y-2">
          <div>
            <Label className="text-sm font-medium">
              <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
            </Label>
            <Input
              disabled
              className="mt-1 bg-muted animate-pulse h-10"
              value=""
            />
          </div>

          <div>
            <Label className="text-sm font-medium">
              <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
            </Label>
            <Input
              disabled
              className="mt-1 bg-muted animate-pulse h-10"
              value=""
            />
          </div>
        </div>

        {/* Game Avatar Section Shimmer */}
        <div className="mt-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
            <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="relative">
              <div className="h-16 w-16 rounded bg-muted animate-pulse"></div>
            </div>
            <div className="flex-1">
              <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
              <div className="h-7 w-20 bg-muted rounded animate-pulse mt-2"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons Shimmer */}
        <div className="mt-0 flex gap-3 justify-end">
          <Button
            disabled
            variant="outline"
            className="h-10 w-20 bg-muted animate-pulse border-none"
          >
            &nbsp;
          </Button>
        </div>
      </Card>
    </div>
  );
}