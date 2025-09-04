import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {type LoginFormData, loginSchema } from "../../schemas/LoginSchema";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/authStore";

const Login = () => {
  const {register,handleSubmit,formState:{errors},reset} = useForm<LoginFormData>({
    resolver:zodResolver(loginSchema)
  });
  const navigate = useNavigate();
  const { loginSuccess} = useAuthStore();

  const onSubmit = async (data:LoginFormData) => {
    const result = await authService.login(data)
    if(result){
      reset();
      toast.success("Login Successfull")
      navigate("/task-list");
      loginSuccess(result);
    }
  };

  return (
    <div className="flex flex-col justify-center sm:h-screen p-4">
      <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
        <div className="text-center mb-12">
          <a href="javascript:void(0)">Login to TaskPlusPlus</a>
        </div>

        <form aria-label="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="text-slate-900 text-sm font-medium mb-2 block"
              >
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
              <label
                htmlFor="password"
                className="text-slate-900 text-sm font-medium mb-2 block"
              >
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
          </div>

          <div className="mt-12">
            <button
              type="submit"
              className="w-full py-3 px-4 text-sm tracking-wider font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
