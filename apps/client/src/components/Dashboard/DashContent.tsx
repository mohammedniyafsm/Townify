import { useState } from 'react'
import { MoreVertical } from "lucide-react";
import { Input } from '../ui/input';
import { type DashboardNavProps } from '@/types/type';
import  CreateRoomModal  from "@/components/Dashboard/CreateRoomModal"
import JoinRoomModal from './JoinRoomModal';


function DashContent({ CreateRoom, setCreateRoom, JoinRoom, setJoinRoom }: DashboardNavProps) {

  const [dashboard, setDashboard] = useState<boolean>(false);


  return (
    <div>
      <div className="flex justify-end py-8">
        <Input className='w-64 bg-white' placeholder="Search Space" />
      </div>

      {/* This is Map list page */}
      <div className="flex flex-wrap gap-10 items-center py-8">

        <div className="">
          <div className="">
            <img
              className='rounded-3xl'
              src="https://res.cloudinary.com/djbawwbzi/image/upload/v1765434825/Screenshot_2025-12-11_120316_nfsuva.png"
              alt="" />
          </div>
          <div className="flex justify-between px-1 py-2">
            <h1>Bridgeon</h1>
            <div className="flex gap-2 items-center">
              <h1 className='text-xs'>2 days ago</h1>
              <MoreVertical onClick={() => setDashboard(true)} className="w-5 h-5 cursor-pointer hover:bg-amber-50 rounded-lg" />
            </div>
            {dashboard && (
              <div className="absolute left-90 top-123 ">
                <div className="flex flex-col text-sm font-medium bg-background py-2  rounded-lg">
                  <h1 onClick={() => setDashboard(false)} className='hover:bg-[#f2f7fc] px-4 py-2 cursor-pointer'>Edit Map</h1>
                  <h1 onClick={() => setDashboard(false)} className='hover:bg-[#f2f7fc] px-4 py-2 cursor-pointer'>Copy URL</h1>
                  <h1 onClick={() => setDashboard(false)} className='hover:bg-[#f2f7fc] px-4 py-2 cursor-pointer'>Delete URL</h1>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="">
          <div className="">
            <img
              className='rounded-3xl'
              src="https://res.cloudinary.com/djbawwbzi/image/upload/v1765434825/Screenshot_2025-12-11_120316_nfsuva.png"
              alt="" />
          </div>
          <div className="flex justify-between px-1 py-2">
            <h1>Bridgeon</h1>
            <div className="flex gap-2 items-center">
              <h1 className='text-xs'>2 days ago</h1>
              <MoreVertical onClick={() => setDashboard(true)} className="w-5 h-5 cursor-pointer hover:bg-amber-50 rounded-lg" />
            </div>
            {dashboard && (
              <div className="absolute left-90 top-123 ">
                <div className="flex flex-col text-sm font-medium bg-background py-2  rounded-lg">
                  <h1 onClick={() => setDashboard(false)} className='hover:bg-[#f2f7fc] px-4 py-2 cursor-pointer'>Edit Map</h1>
                  <h1 onClick={() => setDashboard(false)} className='hover:bg-[#f2f7fc] px-4 py-2 cursor-pointer'>Copy URL</h1>
                  <h1 onClick={() => setDashboard(false)} className='hover:bg-[#f2f7fc] px-4 py-2 cursor-pointer'>Delete URL</h1>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="">
          <div className="">
            <img
              className='rounded-3xl'
              src="https://res.cloudinary.com/djbawwbzi/image/upload/v1765434825/Screenshot_2025-12-11_120316_nfsuva.png"
              alt="" />
          </div>
          <div className="flex justify-between px-1 py-2">
            <h1>Bridgeon</h1>
            <div className="flex gap-2 items-center">
              <h1 className='text-xs'>2 days ago</h1>
              <MoreVertical onClick={() => setDashboard(true)} className="w-5 h-5 cursor-pointer hover:bg-amber-50 rounded-lg" />
            </div>
            {dashboard && (
              <div className="absolute left-90 top-123 ">
                <div className="flex flex-col text-sm font-medium bg-background py-2  rounded-lg">
                  <h1 onClick={() => setDashboard(false)} className='hover:bg-[#f2f7fc] px-4 py-2 cursor-pointer'>Edit Map</h1>
                  <h1 onClick={() => setDashboard(false)} className='hover:bg-[#f2f7fc] px-4 py-2 cursor-pointer'>Copy URL</h1>
                  <h1 onClick={() => setDashboard(false)} className='hover:bg-[#f2f7fc] px-4 py-2 cursor-pointer'>Delete URL</h1>
                </div>
              </div>
            )}
          </div>
        </div>


      </div>

      {/* Create Space Modal/ */}
      <CreateRoomModal CreateRoom={CreateRoom} setCreateRoom={setCreateRoom} />

      {/* Join Space Modal/ */}
      <JoinRoomModal JoinRoom={JoinRoom} setJoinRoom={setJoinRoom} />



    </div>
  )
}

export default DashContent
