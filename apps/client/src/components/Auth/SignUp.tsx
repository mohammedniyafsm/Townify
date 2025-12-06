
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BorderBeam } from "../ui/border-beam"
import LandingNav from "../Landing-page/LandingNav"
import { GoogleIcon } from "../icons/google"
import { useNavigate } from "react-router-dom"

export function SignUp() {
  const navigate = useNavigate();
  return (

    <div className="">

      <LandingNav />

      <div className=" flex justify-center h-screen items-center">
        <Card className="relative w-[350px] overflow-hidden">
          <CardHeader>
            <CardTitle>Signup</CardTitle>
            <CardDescription>
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Username</Label>
                  <Input id="email" type="email" placeholder="Enter your Username" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2" >
            <Button  className="w-full cursor-pointer">Signup</Button>
            <Button variant={"outline"} className="w-full cursor-pointer"> <GoogleIcon/> Signup With Google</Button>
            <h1 className="text-sm">Have an Account Already ?</h1>
            <h1 onClick={()=>navigate('/login')} className="underline hover:text-gray-500 cursor-pointer">Login</h1>
          </CardFooter>
          <BorderBeam duration={8} size={100} />
        </Card>
      </div>
    </div>
  )
}
