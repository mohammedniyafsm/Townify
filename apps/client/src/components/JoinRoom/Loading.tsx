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




export function ProtectedLoading() {
  return (
    <div className="flex items-center justify-center h-[450px] gap-3 text-gray-600">
       <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        linear-gradient(135deg, 
          rgba(248,250,252,1) 0%, 
          rgba(219,234,254,0.7) 30%, 
          rgba(165,180,252,0.5) 60%, 
          rgba(129,140,248,0.6) 100%
        ),
        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(199,210,254,0.4) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(224,231,255,0.3) 0%, transparent 60%)
      `,
          }}
        />
      <Spinner />
      <span className="font-bricogrotesque text-[18px]">
        Loading <LoadingDots/>
      </span>
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="inline-block w-12 ml-1">
      <span className="animate-[dots_1.5s_infinite]">.</span>
      <span className="animate-[dots_1.5s_infinite_0.5s]">.</span>
      <span className="animate-[dots_1.5s_infinite_1s]">.</span>
    </span>
  );
}
