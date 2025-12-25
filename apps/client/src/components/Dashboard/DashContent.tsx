import { useEffect, useState } from 'react'
import { Check, Link, MoreVertical, Trash } from "lucide-react";
import { Input } from '../ui/input';
import { type DashboardNavProps } from '@/types/type';
import CreateSpaceModal from "@/components/Dashboard/CreateSpaceModal"
import JoinRoomModal from './JoinRoomModal';
import { deleteSpace, fetchUserSpaces } from '@/api/SpaceApi';
import { MapCardShimmer } from './MapCardShimmer';
import { RainbowButton } from '../ui/rainbow-button';
import { toast } from 'sonner';


function DashContent({ CreateRoom, setCreateRoom, JoinRoom, setJoinRoom }: DashboardNavProps) {

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [userMap, setuserMap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState(false);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        setLoading(true);
        const response = await fetchUserSpaces();
        console.log(response);
        setuserMap(response.data.spaces || [] );
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
    fetchMap();
  }, [])

  const handlecopy = async (slug: string) => {
    const inviteLink = `${window.location.origin}/join/${slug}`;
    setCopy(true);
    await navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied!");
    setTimeout(() => {
      setCopy(false);
      setActiveMenuId(null);
    }, 700);
  }

  const deleteMap = async (id: string) => {
    try {
      setDeleteLoad(true);
      const response = await deleteSpace(id);
      console.log(response.data);
      setActiveMenuId(null);
      setuserMap((prev)=> prev.filter((s : any)=>(
        s.id !== id
      )))
      setDeleteLoad(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="flex justify-end py-8">
        <Input className='w-64 bg-white' placeholder="Search Space" />
      </div>

      {/* This is Map list page */}
      <div className="flex flex-wrap gap-10 items-center py-8">

        {userMap && userMap.map((map : any, index) => (
          <div key={index} className="">
            <div className="">
              <img
                className='rounded-2xl h-72 w-96'
                src={map.map.thumbnail}
                alt="" />
            </div>

            <div className="flex flex-col  px-1 py-2">
              <div className="flex justify-between items-center">
                <h1 className='font-bricogrotesque text-base font-bold'>{map.name}</h1>
                <div className="flex gap-2 items-center">
                  <h1 className='text-xs'>2 days ago</h1>
                  <MoreVertical 
                      onClick={() => setActiveMenuId(map.id)} 
                      className="w-5 h-5 cursor-pointer hover:bg-amber-50 rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end">

                {activeMenuId == map.id && (
                  <div className="absolute ">
                    <div className="flex flex-col text-sm font-medium bg-background py-2  rounded-lg">
                      <h1 onClick={() => setActiveMenuId(null)} className='hover:bg-[#f2f7fc] px-4 py-2 cursor-pointer font-bricogrotesque'>Edit Map</h1>
                      <h1 onClick={() => handlecopy(map.slug)}
                        className='hover:bg-[#f2f7fc] px-4 py-2 cursor-pointer flex justify-between items-center gap-2 font-bricogrotesque'>
                        Copy URL {copy ? <Check className='h-4 w-3' /> : <Link className='h-4 w-3' />}
                      </h1>
                      <h1 onClick={() => deleteMap(map.id)}
                        className='hover:bg-[#f2f7fc] font-bricogrotesque px-4 py-2 cursor-pointer flex gap-2 items-center'>
                        {deleteLoad ? "Deleting...." : "Delete Space"} <Trash className='h-4 w-3' />
                      </h1>
                    </div>
                  </div>
                )}
                
              </div>
            </div>

          </div>
        ))}

        {loading &&
          <div className="flex flex-wrap gap-6">
            {[...Array(3)].map((_, index) => (
              <MapCardShimmer key={index} />
            ))}
          </div>
        }
      </div>

      {!loading && userMap.length == 0 && (
        <div className="flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <h1 className='text-xl font-bold font-bricogrotesque'>No spaces yet. Create one to get started.</h1>
            <RainbowButton onClick={() => setCreateRoom(true)}>Create Space</RainbowButton>
          </div>
        </div>
      )}

      {/* Create Space Modal/ */}
      <CreateSpaceModal CreateRoom={CreateRoom} setCreateRoom={setCreateRoom} />

      {/* Join Space Modal/ */}
      <JoinRoomModal JoinRoom={JoinRoom} setJoinRoom={setJoinRoom} />

    </div>
  )
}

export default DashContent
