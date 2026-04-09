import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";    


function InvitationsShimmer() {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="h-6 w-48 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
        </div>
      </CardHeader>
      
      {/* Filter Bar Shimmer */}
      <div className="px-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Table Header Shimmer */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b">
              <div className="col-span-1">
                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`col-span-${i === 0 ? 3 : i === 4 ? 2 : 2}`}>
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Table Rows Shimmer */}
            <div className="divide-y">
              {[...Array(5)].map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-12 gap-4 p-4">
                  {/* Checkbox */}
                  <div className="col-span-1 flex items-center">
                    <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                  </div>

                  {/* Email */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-lg animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="col-span-2 flex items-center">
                    <div className="h-6 w-16 bg-muted rounded-full animate-pulse"></div>
                  </div>

                  {/* Invited */}
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <div className="h-6 w-20 bg-muted rounded-full animate-pulse"></div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <div className="hidden sm:flex gap-2">
                      <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
                      <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
                    </div>
                    <div className="sm:hidden">
                      <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default InvitationsShimmer;