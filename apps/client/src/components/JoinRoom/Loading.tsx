import { Spinner } from "../ui/spinner";

function Loading() {
  return (
    <div className="flex items-center justify-center h-[450px] gap-3 text-gray-600">
      <Spinner />
      <span className="font-bricogrotesque">
        Verifying your access…
      </span>
    </div>
  );
}

export default Loading;
