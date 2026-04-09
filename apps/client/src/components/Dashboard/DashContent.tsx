import { useEffect, useRef, useState, useTransition } from "react";
import { Check, Link, MoreVertical, Trash, Search } from "lucide-react";
import { Input } from "../ui/input";
import { type DashboardNavProps } from "@/types/type";
import CreateSpaceModal from "@/components/Dashboard/CreateSpaceModal";
import JoinRoomModal from "./JoinRoomModal";
import { deleteSpace } from "@/api/SpaceApi";
import { MapCardShimmer } from "./MapCardShimmer";
import { RainbowButton } from "../ui/rainbow-button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { deleteUserSpace } from "@/Redux/Slice/UserSpace/UserSpaceSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux/stroe";

function DashContent({
  CreateRoom,
  setCreateRoom,
  JoinRoom,
  setJoinRoom,
}: DashboardNavProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copy, setCopy] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userMap = useSelector((state: RootState) => state.userSpace);
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredSpaces = userMap?.spaces?.filter((space) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      space?.name?.toLowerCase().includes(query) ||
      space?.map?.name?.toLowerCase().includes(query) ||
      space?.slug?.toLowerCase().includes(query)
    );
  }) || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    startTransition(() => {
      setSearchQuery(value);
    });
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlecopy = async (slug: string) => {
    const inviteLink = `${window.location.origin}/join/${slug}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopy(true);
      toast.success("Invite link copied!");
      setTimeout(() => {
        setCopy(false);
        setActiveMenuId(null);
      }, 700);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const deleteMap = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await deleteSpace(id);
      console.log(response.data);
      dispatch(deleteUserSpace({ id }));
      toast.success("Space deleted successfully");
      setActiveMenuId(null);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to delete space"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="flex justify-end py-1">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-white pl-10 pr-10"
            placeholder="Search Space"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
          {/* Search loading indicator */}
          {isPending && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
            </div>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-4 px-1">
          <p className="text-sm text-gray-600">
            {isPending ? (
              "Searching..."
            ) : (
              <>
                Found {filteredSpaces.length} space{filteredSpaces.length !== 1 ? 's' : ''}
                {searchQuery && ` for "${searchQuery}"`}
              </>
            )}
          </p>
        </div>
      )}

      {/* Spaces Grid */}
      <div className="flex flex-wrap gap-10 items-center py-5">
        {userMap?.status === "loading" || userMap?.status === "idle" || isPending ? (
          // Loading shimmer
          <div className="flex flex-wrap gap-6">
            {[...Array(3)].map((_, index) => (
              <MapCardShimmer key={index} />
            ))}
          </div>
        ) : filteredSpaces.length > 0 ? (
          // Filtered spaces
          filteredSpaces.map((map) => (
            <div key={map?.id} className="">
              <div>
                <img
                  onClick={() => navigate(`/lobby/${map?.slug}`)}
                  className="rounded-2xl h-72 w-90 cursor-pointer hover:opacity-90 transition-opacity"
                  src={map?.map?.thumbnail}
                  alt={map?.name || "Space thumbnail"}
                />
              </div>

              <div className="flex flex-col px-1 py-2 ">
                <div className="flex justify-between items-center relative">
                  <h1 className="font-bricogrotesque text-base font-bold truncate max-w-[200px]">
                    {map?.name}
                  </h1>
                  <div className="flex gap-2 items-center ">
                    <h1 className="text-xs text-gray-500">2 days ago</h1>
                    <MoreVertical
                      onClick={() => setActiveMenuId(activeMenuId === map?.id ? null : map?.id)}
                      className="w-5  h-5 cursor-pointer hover:bg-amber-50 rounded-lg p-0.5 transition-colors"
                    />
                  </div>

                  {activeMenuId === map?.id && (
                    <div ref={menuRef} className="absolute right-0 top-7 z-10">
                      <div className="flex flex-col text-sm font-medium bg-background py-2 rounded-lg shadow-lg border border-gray-200 min-w-[130px]">
                        <button
                          onClick={() => handlecopy(map?.slug)}
                          className='hover:bg-[#f2f7fc] px-4 py-2 cursor-pointer flex justify-between gap-2 items-center  font-bricogrotesque transition-colors'
                        >
                          Copy URL {copy ? <Check className='h-4 w-3' /> : <Link className='h-4 w-3' />}
                        </button>
                        <button
                          onClick={() => navigate(`/space/manage/${map?.slug}`)}
                          className='hover:bg-[#f2f7fc] px-4 py-2 cursor-pointer flex justify-between items-center gap-2 font-bricogrotesque transition-colors'
                        >
                          Manage Space
                        </button>
                        <button
                          onClick={() => deleteMap(map?.id)}
                          disabled={deletingId === map?.id}
                          className='hover:bg-[#f2f7fc] font-bricogrotesque px-4 py-2 cursor-pointer flex justify-between gap-2 items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          {deletingId === map?.id ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                              Deleting...
                            </>
                          ) : (
                            <>
                              Delete Space <Trash className='h-4 w-3' />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>



              </div>
            </div>
          ))
        ) : searchQuery ? (
          // No search results
          <div className="w-full text-center py-12">
            <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No spaces found
            </h3>
            <p className="text-gray-500 mb-4">
              No spaces match "{searchQuery}"
            </p>
            <button
              onClick={handleClearSearch}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : null}
      </div>

      {/* Show empty state only when loading is done AND there are no spaces */}
      {userMap?.status === "succeeded" &&
        filteredSpaces.length === 0 &&
        !searchQuery && (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center gap-6 max-w-md text-center">
              <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold font-bricogrotesque">
                No spaces yet
              </h1>
              <p className="text-gray-600">
                Create your first space to start collaborating with your team
              </p>
              <RainbowButton onClick={() => setCreateRoom(true)}>
                Create Your First Space
              </RainbowButton>
            </div>
          </div>
        )}

      {/* Create Space Modal */}
      <CreateSpaceModal CreateRoom={CreateRoom} setCreateRoom={setCreateRoom} />

      {/* Join Space Modal */}
      <JoinRoomModal JoinRoom={JoinRoom} setJoinRoom={setJoinRoom} />
    </div>
  );
}

export default DashContent;