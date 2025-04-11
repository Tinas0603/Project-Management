import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState,useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FaUserCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Logo from "@/components/logo";
import GoogleOauthButton from "@/components/auth/google-oauth-button";
import { useMutation } from "@tanstack/react-query";
import { loginMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useStore } from "@/store/store";

const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  // State for "Remember Me" checkbox
  const [rememberMe, setRememberMe] = useState(false);

  const {setAccessToken} =useStore();

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  const formSchema = z.object({
    email: z.string().trim().email("Invalid email address").min(1, {
      message: "Workspace name is required",
    }),
    password: z.string().trim().min(1, {
      message: "Password is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Check for saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      form.setValue("email", savedEmail); // Prefill email field
      setRememberMe(true); // Check the box
    }
  }, [form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;

    mutate(values, {
      onSuccess: (data) => {
        const accessToken=data.access_token;
        const user = data.user;
        setAccessToken(accessToken);
        const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;
        navigate(decodedUrl || `/workspace/${user.currentWorkspace}`);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };




return (
  <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6">
    <div className="flex w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
      {/* Left Geometric Background */}
      <div className="hidden md:block w-1/3 bg-gradient-to-br from-pink-400 to-pink-300 relative">
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="0,0 100,0 0,100" fill="rgba(255,255,255,0.2)" />
            <polygon points="0,100 100,0 100,100" fill="rgba(255,255,255,0.1)" />
          </svg>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="w-full md:w-2/3 bg-white p-8">
        {/* Logo */}
        <div className="flex justify-center mb-3">
        <span className="flex items-center gap-2">
        <div className="cursor-pointer"> {/* Increased width and height */}
              {/* Placeholder for the logo (replace with your actual logo) */}
              <img 
                src="/images/taskmaster_logo2.png" 
                alt="Logo" 
                className="" // Use object-contain to maintain aspect ratio
              />
            </div>
          </span>
        </div>

        {/* Tabs (Login / Sign Up) */}
        <div className="flex justify-center gap-4 mb-6">
          <button className="text-lg font-semibold text-pink-500 border-b-2 border-pink-500 pb-1">
            LOGIN
          </button>
          <button className="text-lg font-semibold text-gray-500 pb-1">
          <Link
              to="/sign-up"
              className="">
            SIGN UP
            </Link>
          </button>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaUserCircle />
                      </span>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          className="pl-10 h-12 rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

                  return (
                    <FormItem>
                      <div className="relative">
                        {/* Lock icon on the left */}
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <RiLockPasswordFill />
                        </span>
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"} // Toggle between text and password
                            placeholder="Password"
                            className="pl-10 pr-10 h-12 rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500" // Added pr-10 for right icon
                            {...field}
                          />
                        </FormControl>
                        {/* Eye icon on the right */}
                        <span
                          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <FaEye size={20} /> : <IoIosEyeOff size={20} />}
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Remember Me Checkbox and Forgot Password Link */}
              <div className="flex justify-between items-center">
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      className="border-gray-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                    />
                    <span className="text-sm text-gray-600">Remember Me</span>
                  </label>
                  <a href="#" className="text-sm text-pink-500 hover:underline">
                    Forgot Password?
                  </a>
                </div>

              {/* Login Button */}
              <Button
                disabled={isPending}
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white h-12 rounded-lg"
              >
                LOGIN
              </Button>
            </div>

            {/* Social Login */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">Or Log in with</p>
              <div className="flex justify-center gap-4">
                {/* <Button
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 h-10 rounded-lg"
                >
                  <GoogleIcon />
                  Google
                </Button> */}
                <GoogleOauthButton label="Login" />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  </div>
);
}

export default SignIn;
