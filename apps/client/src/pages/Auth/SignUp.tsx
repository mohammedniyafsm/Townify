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
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useGoogleLogin } from "@react-oauth/google"
import axios from "axios"
import { signupSchema, type SignupInput } from "@repo/zod-schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerUser } from "@/api/authApi"
import { useDispatch } from "react-redux"
import { addAuth } from "@/Redux/Slice/Auth/Auth"
import type { AppDispatch } from "@/Redux/stroe"

export function SignUp() {
  const navigate = useNavigate()
  const dispatch=useDispatch<AppDispatch>()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupInput) => {
    try {
      const response = await registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
      })

      console.log(response)

      toast.success("Your account has been created!", {
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      })

      setTimeout(() => navigate("/login"), 1000)
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response.data.message || "Something went wrong")
    }
  }

  const responseGoogle = async (authResult: any) => {
    try {
      if (authResult?.code) {
        const response=await axios.get(`http://localhost:8080/auth/googleLogin?code=${authResult.code}`, {
          withCredentials: true,
        })
        dispatch(addAuth(response.data.user))
        navigate("/")
      }
    } catch (error) {
      toast.error("Google login failed")
      console.error(error)
    }
  }

  const GoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  })

  return (
    <div>
      <LandingNav />

      <div className="flex justify-center items-center h-screen mt-9">
        <Card className="relative w-[380px] overflow-hidden mt-6">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create your Townify account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" /> Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              onClick={() => GoogleLogin()}
              variant="outline"
              className="w-full cursor-pointer"
              type="button"
            >
              <GoogleIcon className="mr-2" />
              Sign up with Google
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="underline underline-offset-4 hover:text-primary cursor-pointer"
              >
                Log in
              </button>
            </p>
          </CardFooter>

          <BorderBeam duration={8} size={100} />
        </Card>
      </div>
    </div>
  )
}