import { Building, Rocket } from "lucide-react";
import { fetchAllRoomTemplate } from '../../api/authApi';
import { type CreateRoomModalI, type mapTemplateI } from '@/types/type';
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { BorderBeam } from '../ui/border-beam';

function CreateRoomModal({ CreateRoom, setCreateRoom }: CreateRoomModalI) {

    const [maptemplate, setMapTemplate] = useState<mapTemplateI[] | []>([]);
    const [currentMap, setCurrentMap] = useState<mapTemplateI | null>(null);
    const [RoomName, setRoomName] = useState<string>('');

    useEffect(() => {
        const fetchMapTemplate = async () => {
            const response = await fetchAllRoomTemplate();
            const maps = response.data.maps;

            setMapTemplate(maps);
            if (maps.length > 0) {
                setCurrentMap(maps[0]);
            }
        };

        fetchMapTemplate();
    }, [])

    const handleSubmit = () => {
        if (RoomName.trim() === '') return;
        console.log(error);
    }

    return (
        <div>
            {CreateRoom && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Card className="relative w-[500px] rounded-2xl shadow-xl overflow-hidden">
                        <CardHeader>
                            <CardTitle className='font-bricogrotesque'>Create Space</CardTitle>
                            <CardDescription className='font-bricogrotesque'>Choose your office template.</CardDescription>
                        </CardHeader>

                        <CardContent >
                            <div className="flex gap-4">
                                <>
                                    <div className="">
                                        <Input onChange={(e) => setRoomName(e.target.value)} placeholder="Enter Room name " className="mb-2" />
                                        <img
                                            className="rounded-xl w-96 h-44 object-cover"
                                            src={currentMap?.thumbnail}
                                            alt=""
                                        />
                                        {/* <Input placeholder="Enter Room name " className="mt-2" /> */}
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {maptemplate.map((map, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => setCurrentMap(map)}
                                                variant={currentMap?.id === map.id ? "default" : "outline"}
                                                className="flex items-center gap-2 cursor-pointer">
                                                <Building className="w-4 h-4 font-bricogrotesque " />
                                                {map.name}
                                            </Button>
                                        ))}
                                        {/* <Button variant="outline" className="flex items-center gap-2 font-bricogrotesque">
                                               <Rocket className="w-4 h-4" />
                                                  Startup
                                                </Button> */}
                                    </div>
                                </>

                            </div >
                        </CardContent>

                        <CardFooter className="flex justify-end gap-3">
                            <Button className='font-bricogrotesque' variant="outline" onClick={() => setCreateRoom(false)}>Cancel</Button>
                            <Button onClick={handleSubmit} className='font-bricogrotesque'>Create</Button>
                        </CardFooter>

                        <BorderBeam duration={8} size={100} />
                    </Card>
                </div>
            )
            }
        </div >
    )
}

export default CreateRoomModal
