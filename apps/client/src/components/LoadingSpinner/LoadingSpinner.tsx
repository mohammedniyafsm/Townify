import {HashLoader} from "react-spinners";
function LoadingSpinner() {
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
      <div className="relative z-10 flex flex-col items-center gap-4">
        <HashLoader 
          color="#6366f1" 
          size={60} 
          speedMultiplier={1.2}
        />
        <span className="text-sm font-medium text-indigo-600/80 tracking-wide">
          loading...
        </span>
      </div>
   </div>
  );
}

export default LoadingSpinner;