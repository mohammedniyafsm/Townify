import { Spinner } from "../ui/spinner";

export function Loading() {
  return (
    <div className="flex items-center justify-center h-[450px] gap-3 text-gray-600">
      <Spinner />
      <span className="font-bricogrotesque">
        Verifying your access…
      </span>
    </div>
  );
}



export function LoadingSpace() {
  return (
    <div className="flex items-center justify-center h-[450px] gap-3 text-gray-600">
      <Spinner />
      <span className="font-bricogrotesque">
        Loading Space...
      </span>
    </div>
  );
}

