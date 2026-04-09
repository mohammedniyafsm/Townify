import { Skeleton } from "@/components/ui/skeleton"


export const MapCardShimmer = () => {
  return (
    <div className="">
      {/* Thumbnail shimmer */}
      <Skeleton className="rounded-3xl h-72 w-90" />

      {/* Bottom content shimmer */}
      <div className="flex justify-between px-1 py-2">
        {/* Title */}
        <Skeleton className="h-4 w-32" />

        <div className="flex gap-2 items-center">
          {/* Time */}
          <Skeleton className="h-3 w-16" />
          {/* More icon */}
          <Skeleton className="h-5 w-5 rounded-md" />
        </div>
      </div>
    </div>
  )
}
