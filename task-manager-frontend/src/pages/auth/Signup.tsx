import React from "react";
import { useForm } from "react-hook-form";
import { signupSchema, type SignupFormData } from "../../schemas/SignupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const Signup = () => {
  const {register,handleSubmit,formState:{errors},reset} = useForm<SignupFormData>({
    resolver:zodResolver(signupSchema)
  });

  const navigate = useNavigate();

  const onSubmit = async (data:SignupFormData)=>{
    console.log("Sign up form data",data);
    const response = await authService.register(data);
    console.log("🚀 ~ onSubmit ~ response:", response)
    if(response){
      reset();
      toast.success("Registered Successfully!")
      navigate("/login");
    }
  }

  return (
    <div className="flex flex-col justify-center sm:h-screen p-4">
      <div className="max-w-md w-full mx-auto border bg-gray-100 border-gray-300 rounded-2xl p-8">
        <div className="text-center mb-12">
          <a href="javascript:void(0)">Register for TaskPlusPlus</a>
        </div>

        <form aria-label="signup-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="text-slate-900 text-sm font-medium mb-2 block">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="text-slate-900 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter email"
                {...register("email")}
              />
              {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            </div>
            <div>
              <label htmlFor="full-name" className="text-slate-900 text-sm font-medium mb-2 block">
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                className="text-slate-900 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter Full name"
                {...register("fullName")}
              />
              {errors.fullName && <span className="text-red-500">{errors.fullName.message}</span>}
            </div>
            <div>
              <label htmlFor="password" className="text-slate-900 text-sm font-medium mb-2 block">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="text-slate-900 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter password"
                {...register("password")}
              />
              {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>
            <div>
              <label htmlFor="confirm-password" className="text-slate-900 text-sm font-medium mb-2 block">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                className="text-slate-900 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter confirm password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
            </div>
          </div>

          <div className="mt-12">
            <button
              type="submit"
              className="w-full py-3 px-4 text-sm tracking-wider font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
            >
              Register
            </button>
          </div>
          <p className="text-slate-600 text-sm mt-6 text-center">
            Already have an account?{" "}
            <a
              onClick={()=>{
                navigate("/login")
              }}
              className="text-blue-600 font-medium hover:underline ml-1"
            >
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
