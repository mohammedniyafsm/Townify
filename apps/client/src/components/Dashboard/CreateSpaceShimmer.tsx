import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const CreateSpaceShimmer = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Card className="relative w-[500px] rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <CardHeader className="space-y-2">
          <CardTitle className='font-bricogrotesque'>Create Space</CardTitle>
          <CardDescription className='font-bricogrotesque'>Choose your office template.</CardDescription>
        </CardHeader>

        {/* Content */}
        <CardContent>
          <div className="flex gap-4">

            {/* Left side */}
            <div className="flex-1 space-y-3">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-44 w-full rounded-xl" />
            </div>

            {/* Right side buttons */}
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-10 w-32 rounded-md"
                />
              ))}
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-end gap-3">
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </CardFooter>
      </Card>
    </div>
  )
}

export default CreateSpaceShimmer
