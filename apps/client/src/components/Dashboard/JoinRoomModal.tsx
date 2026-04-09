import type { JoinRoomModalI } from '@/types/type'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { BorderBeam } from '../ui/border-beam'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function JoinRoomModal({ JoinRoom,setJoinRoom} : JoinRoomModalI) {
  const [url, setUrl] = useState('')
  const navigate = useNavigate();
  const handleJoin = () => {  
    const trimmedUrl = url.trim();
    if (trimmedUrl) {
      const parts = trimmedUrl.split('/');
      const lastPart = parts[parts.length - 1];
      console.log("Navigating to:", `/join/${lastPart}`);
      navigate(`/join/${lastPart}`);
      setJoinRoom(false);
    }
  }
  return (
    <div>
         {JoinRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Card className="relative w-[500px] rounded-2xl shadow-xl overflow-hidden">
            <CardHeader>
              <CardTitle className='font-bricogrotesque'>Join Space</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>

            <CardContent >
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5 gap-1">
                    <Label htmlFor="email" className='font-bricogrotesque'>Enter Space url</Label>
                    <Input className='font-bricogrotesque'value={url} onChange={(e)=>setUrl(e.target.value)} id="" type="text" placeholder="Paste Url..." />
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-end gap-3">
              <Button 
                className='font-bricogrotesque' variant="outline" onClick={() => setJoinRoom(false)} >Cancel</Button>
              <Button className='font-bricogrotesque' onClick={handleJoin}>Join</Button>
            </CardFooter>

            <BorderBeam duration={8} size={100} />
          </Card>
        </div>
      )}
    </div>
  )
}

export default JoinRoomModal
