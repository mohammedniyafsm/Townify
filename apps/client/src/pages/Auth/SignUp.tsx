
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
import { BorderBeam } from "@/components/ui/border-beam"
import LandingNav from "@/components/Landing-page/LandingNav"
import { GoogleIcon } from "@/components/icons/google"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { registerUser } from "@/api/authApi"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useGoogleLogin } from "@react-oauth/google"
import axios from "axios"

export function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>("");
  const [username, setUsername] = useState<string | null>("");
  const [password, setPassword] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      console.log(email, username, password)
      setLoading(true);
      const response = await registerUser({ email, password, name: username });
      console.log(response)
      if (response) {
        setLoading(false);
        toast.success("Your account has been created.", {
          // description: "Your account has been created.",
          action: {
            label: "Login",
            onClick: () => navigate("/login"),
          },
        });
        setTimeout(() => {
          navigate('/login');
        }, 1000)
      }
    } catch (error) {
      setLoading(false);
      console.log(error)
    }
  }

  const responseGoogle = async (authResult: any) => {
    
    try {
      console.log(authResult);
      
      if (authResult['code']) {
        const response = await axios.get(`http://localhost:8080/auth/googleLogin?code=${authResult.code}`,
          { withCredentials: true });
           navigate('/');
           console.log(response)
        }
    } catch (error) {
      console.error('Error while requisting google code', error)
    }
  }

  const GoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code'
  })

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
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input onChange={((e) => setUsername(e.target.value))}
                    id="username" type="username" placeholder="Enter your Username" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input onChange={((e) => setEmail(e.target.value))}
                    id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input onChange={((e) => setPassword(e.target.value))}
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              {loading ?
                <Button className="w-full cursor-pointer mt-4"> <Spinner />  Creating Account...</Button>
                : <Button variant={"default"} type={"submit"} className="w-full cursor-pointer mt-4"> Signup</Button>
              }
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2" >
            <Button onClick={() => GoogleLogin()} variant={"outline"} className="w-full cursor-pointer"> <GoogleIcon /> Signup With Google</Button>
            <h1 className="text-sm">Have an Account Already ?</h1>
            <h1 onClick={() => navigate('/login')} className="underline hover:text-gray-500 cursor-pointer text-xs">Login</h1>
          </CardFooter>
          <BorderBeam duration={8} size={100} />
        </Card>
      </div>
    </div>
  )
}
