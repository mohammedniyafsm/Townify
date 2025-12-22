import { Building } from "lucide-react";
import { CreateSpaceApi, fetchAllRoomTemplate } from '../../api/SpaceApi';
import { type CreateRoomModalI, type mapTemplateI } from '@/types/type';
import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { BorderBeam } from '../ui/border-beam';
import CreateSpaceShimmer from "./CreateSpaceShimmer";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function CreateSpaceModal({ CreateRoom, setCreateRoom }: CreateRoomModalI) {

    const [maptemplate, setMapTemplate] = useState<mapTemplateI[] | []>([]);
    const [currentMap, setCurrentMap] = useState<mapTemplateI | null>(null);
    const [RoomName, setRoomName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const inputbox = useRef<HTMLInputElement>(null);
    const [CreateRoomLoading, setCreateRoomLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchMapTemplate = async () => {
            const response = await fetchAllRoomTemplate();
            const maps = response.data.maps;

            setMapTemplate(maps);
            if (maps.length > 0) {
                setCurrentMap(maps[0]);
                setLoading(false);
            }
        };
        fetchMapTemplate();
    }, [])

    const handleSubmit = async () => {
        try {
            if (RoomName.trim() === '') {
                inputbox.current?.focus();
                return;
            }
            if (currentMap === null) return;
            setCreateRoomLoading(true);
            const response = await CreateSpaceApi(RoomName, currentMap.id);
            console.log(response);

            setTimeout(()=>{
                setCreateRoomLoading(false);
                toast.success("Space Created Successfully!", {
                    action: {
                        label: "Invite",
                        onClick: () => navigate(`/invite/${response.data.space.slug}`),
                    },
                })
                navigate(`/invite/${response.data.space.slug}`);
            },3000)

        } catch (error) {
            setCreateRoomLoading(false)
            console.log(error);
        }
    }

    return (
        <div>
            {CreateRoom &&
                (loading ? <CreateSpaceShimmer /> :
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
                                            <Input ref={inputbox}
                                                onChange={(e) => setRoomName(e.target.value)}
                                                placeholder="Enter Space name " className="mb-2" />
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
                                <Button onClick={handleSubmit} className='font-bricogrotesque'>
                                    {CreateRoomLoading ? <><Spinner /> <h1>Creating...</h1></> : "Create"}
                                </Button>
                            </CardFooter>

                            <BorderBeam duration={8} size={100} />
                        </Card>
                    </div>
                )
            }
        </div >
    )
}

export default CreateSpaceModal
