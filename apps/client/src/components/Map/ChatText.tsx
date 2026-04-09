import { Building2, MapPin, RotateCcw, SquarePen, X } from "lucide-react";

function ChatText() {

    
  return (
    <div className="flex justify-end">
      <div className="h-screen w-96 bg-[#202540] text-white">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h1 className="text-lg font-semibold">Chat</h1>

          {/* Header Icons */}
          <div className="flex gap-4">
            
            {/* Retry */}
            <div className="relative group">
              <RotateCcw className="w-5 h-5 cursor-pointer hover:text-blue-400" />
              {/* <span className="absolute -top-8 left-1/2 -translate-x-1/2 
                whitespace-nowrap rounded bg-black px-2 py-1 text-xs opacity-0 
                group-hover:opacity-100 transition">
                Retry
              </span> */}
            </div>

            {/* Edit */}
            <div className="relative group">
              <SquarePen className="w-5 h-5 cursor-pointer hover:text-green-400" />
              {/* <span className="absolute -top-8 left-1/2 -translate-x-1/2 
                whitespace-nowrap rounded bg-black px-2 py-1 text-xs opacity-0 
                group-hover:opacity-100 transition">
                Edit
              </span> */}
            </div>

            {/* Close */}
            <div className="relative group">
              <X className="w-5 h-5 cursor-pointer hover:text-red-400" />
              {/* <span className="absolute -top-8 left-1/2 -translate-x-1/2 
                whitespace-nowrap rounded bg-black px-2 py-1 text-xs opacity-0 
                group-hover:opacity-100 transition">
                Close
              </span> */}
            </div>

          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">

          {/* Room Name */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Building2 className="w-12 h-12 bg-blue-700 p-3 rounded-full cursor-pointer" />
              {/* <span className="absolute -top-8 left-1/2 -translate-x-1/2 
                whitespace-nowrap rounded bg-black px-2 py-1 text-xs opacity-0 
                group-hover:opacity-100 transition">
                Room
              </span> */}
            </div>
            <h1 className="text-sm font-bricogrotesque font-bold">Room Name</h1>
          </div>

          {/* Current Space */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <MapPin className="w-12 h-12 bg-red-500 p-3 rounded-full cursor-pointer" />
              {/* <span className="absolute -top-8 left-1/2 -translate-x-1/2 
                whitespace-nowrap rounded bg-black px-2 py-1 text-xs opacity-0 
                group-hover:opacity-100 transition">
                Current Space
              </span> */}
            </div>
            <h1 className="text-sm font-bricogrotesque font-bold">Current Space Name</h1>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ChatText;
