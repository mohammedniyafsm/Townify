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
import { BorderBeam } from "@/components/ui/border-beam"
import LandingNav from "@/components/Landing-page/LandingNav"
import { useNavigate, useSearchParams } from "react-router-dom"
import React, { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { resendOtpApi, verifyOTP } from "@/api/authApi"
import { useLocation } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/Redux/stroe"
import { addAuth } from "@/Redux/Slice/Auth/Auth"

export function OTP() {

    const navigate = useNavigate()
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>()
    const emailFromState = location.state?.email;
    const [sendOtp, setsendOtp] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(60);
    const email = emailFromState || localStorage.getItem("otpEmail");
    console.log("EMAIL RECEIVED:", email);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    inputRefs.current = Array(5).fill(null).map((_, i) => inputRefs.current[i] ?? null)
    const [searchParams] = useSearchParams();
    const redirectParam = searchParams.get("redirect");

    useEffect(() => {
        if (!sendOtp) return;   // Run only when sendOtp = true

        const timer = setInterval(() => {
            setCount((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setsendOtp(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [sendOtp]);

    useEffect(() => {
        setsendOtp(true);
    }, [])



    const getOTP = () => {
        return inputRefs.current.map((input) => input?.value || "").join("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();

            const otp = getOTP();
            console.log("OTP Entered:", otp);

            if (otp.length !== 5) {
                toast.error("Please enter all 5 digits.");
                return;
            }
            setLoading(true);
            const response = await verifyOTP({ email, otp });
            const redirectUrl = redirectParam ? redirectParam : "/";
            console.log(response)
            if (response) {
                dispatch(addAuth(response.data.user))
                toast.success("LoggedIn Successful!.", {
                    action: {
                        label: "Home",
                        onClick: () => { response.data.role == 'admin' ? navigate("/admin") : navigate(redirectUrl) },
                    },
                });
                setTimeout(() => {
                    setLoading(false);
                    navigate(redirectUrl);
                }, 2000);
            }
        } catch (error: any) {
            setLoading(false);
            toast.error(error?.response?.data?.message || error.message || "Invalid OTP or Expired")
            console.log(error)
        }
    };


    const resendOtp = async () => {
        try {
            const response = await resendOtpApi({ email });
            console.log(response)
            if (response.status === 202) {
                toast.success("OTP sent successfully!");

                setsendOtp(true);
                setCount(60);
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.message || error.message)
            toast.error("Something went wrong");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value

        // Only allow single digit
        if (!/^[0-9]$/.test(value)) {
            e.target.value = ""
            return
        }

        if (index < 4) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (!e.currentTarget.value && index > 0) {
                inputRefs.current[index - 1]?.focus()
            }
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5)

        pasted.split("").forEach((char, i) => {
            if (inputRefs.current[i]) {
                inputRefs.current[i]!.value = char
            }
        })

        // Focus last filled or last input
        const nextFocus = pasted.length < 5 ? pasted.length : 4
        inputRefs.current[nextFocus]?.focus()
    }

    return (
        <div>
            <LandingNav />

            <div className="flex justify-center h-screen items-center">
                <Card className="relative w-[350px] overflow-hidden">
                    <CardHeader>
                        <CardTitle>OTP VERIFICATION</CardTitle>
                        <CardDescription>
                            Enter your OTP to access your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} onPaste={handlePaste}>
                            <div className="flex w-full items-center gap-4 justify-center">
                                {[0, 1, 2, 3, 4].map((index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => { (inputRefs.current[index] = el) }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        className="h-14 w-14 text-center text-2xl font-bold 
                                                   [appearance:textfield] 
                                                   [&::-webkit-outer-spin-button]:hidden 
                                                   [&::-webkit-inner-spin-button]:hidden"
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                    />
                                ))}
                            </div>
                            <Button className="w-full mt-4" disabled={loading} type="submit">
                                {loading ? <span className="flex gap-1 cursor-pointer"><Spinner />OTP Submitting...</span> : "Submit"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <p className="text-sm text-muted-foreground">
                            Didn’t receive OTP?
                        </p>
                        <button
                            type="button"
                            disabled={sendOtp}
                            onClick={resendOtp}
                            className={`text-xs hover:underline hover:text-gray-500 ${sendOtp ? "cursor-no-drop" : "cursor-pointer"} `}
                        >
                            Resend OTP {sendOtp ? `(${count}s)` : ""}
                        </button>
                    </CardFooter>
                    <BorderBeam duration={8} size={100} />
                </Card>
            </div>
        </div>
    )
}