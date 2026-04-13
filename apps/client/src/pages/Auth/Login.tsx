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
import { useNavigate, useSearchParams } from "react-router-dom"
import { Spinner } from "@/components/ui/spinner"
import { loginUser } from "@/api/authApi"
import { toast } from "sonner"
import { useGoogleLogin } from "@react-oauth/google"
import axios from "axios"
import { loginSchema, type LoginInput } from "@repo/zod-schemas"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/Redux/stroe"
import { addAuth } from "@/Redux/Slice/Auth/Auth"
import { useState } from "react"

export function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [searchParams] = useSearchParams();
    const [googleSubmitting, setGoogleSubmitting] = useState(false)


  const redirectParam = searchParams.get("redirect");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      })

      if (response) {
        const email = data.email
        const otpUrl = redirectParam ? `/auth/otp?redirect=${redirectParam}` : "/auth/otp";
        toast.success("Login successful! Sending OTP...", {
          action: {
            label: "Verify OTP",
            onClick: () => navigate(otpUrl, { state: { email } }),
          },
        })

        localStorage.setItem("otpEmail", email)

        setTimeout(() => {
          navigate(otpUrl, { state: { email } })
        }, 100)
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Invalid credentials")
      console.error(error)
    }
  }

  const responseGoogle = async (authResult: any) => {
    setGoogleSubmitting(true)
    try {
      if (authResult?.code) {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const response = await axios.get(`${baseUrl}/auth/googleLogin?code=${authResult.code}`, {
          withCredentials: true,
        })
        console.log(response.data)
        dispatch(addAuth(response.data.user))
        if (response.data.user.role == 'admin') navigate("/admin")
        else if (redirectParam) {
          navigate(redirectParam)
        }
        else navigate("/")
        toast.success("Logged in with Google!")
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Google login failed")
      console.error(error)
    } finally {
      setGoogleSubmitting(false)
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  })

  return (
    <div>
      <LandingNav />

      <div className="flex justify-center items-center h-screen mt-5">
        <Card className="relative w-[380px] overflow-hidden mt-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Log in to your Townify account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
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
                  <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || googleSubmitting}>
                {isSubmitting || googleSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
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

            <Button onClick={() => googleLogin()} disabled={isSubmitting || googleSubmitting} variant="outline" className="w-full cursor-pointer">
              <GoogleIcon className="mr-2 h-5 w-5 " />
              Continue with Google
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  if (redirectParam) {
                    navigate(`/signup?redirect=${redirectParam}`)
                  }
                  else {
                    navigate("/signup")
                  }
                }}
                className="font-medium underline underline-offset-4 hover:text-primary cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </CardFooter>

          <BorderBeam duration={10} />
        </Card>
      </div>
    </div>
  )
}