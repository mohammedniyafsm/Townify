import { Building, ChevronLeft } from "lucide-react";
import { createSpace, fetchAllRoomTemplates } from '../../api/SpaceApi';
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
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/Redux/stroe";
import { addUserSpace } from "@/Redux/Slice/UserSpace/UserSpaceSlice";

function CreateSpaceModal({ CreateRoom, setCreateRoom }: CreateRoomModalI) {

    const [maptemplate, setMapTemplate] = useState<mapTemplateI[] | []>([]);
    const [currentMap, setCurrentMap] = useState<mapTemplateI | null>(null);
    const [RoomName, setRoomName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const inputbox = useRef<HTMLInputElement>(null);
    const [CreateRoomLoading, setCreateRoomLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch=useDispatch<AppDispatch>()
    
    // NEW: Track current step
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);

    useEffect(() => {
        setLoading(true);
        const fetchMapTemplate = async () => {
            const response = await fetchAllRoomTemplates();
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
                if (currentStep === 2) {
                    setCurrentStep(1);
                    inputbox.current?.focus();
                    return;
                }
                inputbox.current?.focus();
                return;
            }
            
            if (currentStep === 1) {
                setCurrentStep(2);
                return;
            }
            
            if (currentMap === null) return;
            setCreateRoomLoading(true);
            const response = await createSpace(RoomName, currentMap.id);
            console.log(response);
            dispatch(addUserSpace({space:response.data.space}))
            
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

    const handleBack = () => {
        setCurrentStep(1);
    }

    useEffect(() => {
        if (!CreateRoom) {
            setCurrentStep(1);
            setRoomName('');
        }
    }, [CreateRoom]);

    return (
        <div>
            {CreateRoom &&
                (loading ? <CreateSpaceShimmer /> :
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <Card className="relative w-[500px] rounded-2xl shadow-xl overflow-hidden">
                            <CardHeader>
                                <CardTitle className='font-bricogrotesque'>
                                    {currentStep === 1 ? 'Create a new office space' : 'Choose your office template'}
                                </CardTitle>
                                <CardDescription className='font-bricogrotesque'>
                                    {currentStep === 1 
                                        ? 'Enter your space name' 
                                        : 'Select the size and theme of your office. You can change this later!'}
                                </CardDescription>
                            </CardHeader>

                            <CardContent >
                                {currentStep === 1 ? (
                                    // STEP 1: Enter Space Name
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Space Name *
                                            </label>
                                            <Input 
                                                ref={inputbox}
                                                value={RoomName}
                                                onChange={(e) => setRoomName(e.target.value)}
                                                placeholder="Enter your space name" 
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    // STEP 2: Choose Map Template
                                    <div className="flex gap-4">
                                        <div className="w-full">
                                            <div className="mb-4">
                                                <h3 className="font-medium mb-2">Map theme</h3>
                                                <img
                                                    className="rounded-xl w-full h-44 object-cover mb-4"
                                                    src={currentMap?.thumbnail}
                                                    alt={currentMap?.name || "Map thumbnail"}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {maptemplate.map((map, index) => (
                                                <Button
                                                    key={index}
                                                    onClick={() => setCurrentMap(map)}
                                                    variant={currentMap?.id === map.id ? "default" : "outline"}
                                                    className="flex items-center gap-2 cursor-pointer justify-start"
                                                >
                                                    <Building className="w-4 h-4 font-bricogrotesque " />
                                                    {map.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="flex justify-between gap-3">
                                {currentStep === 1 ? (
                                    // STEP 1 Buttons
                                    <>
                                        <Button 
                                            className='font-bricogrotesque' 
                                            variant="outline" 
                                            onClick={() => setCreateRoom(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            onClick={handleSubmit} 
                                            className='font-bricogrotesque'
                                            disabled={RoomName.trim() === ''}
                                        >
                                            Next
                                        </Button>
                                    </>
                                ) : (
                                    // STEP 2 Buttons
                                    <>
                                        <Button 
                                            className='font-bricogrotesque flex items-center gap-2' 
                                            variant="outline" 
                                            onClick={handleBack}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Back
                                        </Button>
                                        <Button 
                                            onClick={handleSubmit} 
                                            className='font-bricogrotesque'
                                            disabled={CreateRoomLoading}
                                        >
                                            {CreateRoomLoading ? (
                                                <>
                                                    <Spinner className="mr-2"  /> 
                                                    Creating...
                                                </>
                                            ) : (
                                                'Confirm Selection'
                                            )}
                                        </Button>
                                    </>
                                )}
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