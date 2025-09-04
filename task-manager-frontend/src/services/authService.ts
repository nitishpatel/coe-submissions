import type { LoginFormData } from "../schemas/LoginSchema";
import type { SignupFormData } from "../schemas/SignupSchema";
import type { LoginResponse, User } from "../types";
import { httpService } from "./http";

export const authService = {
  register: async (data: SignupFormData) => {
    const response = await httpService.post<User>("/auth/signup", data);
    return response.data;
  },
  login: async (data: LoginFormData) => {
    const response = await httpService.post<LoginResponse>("/auth/login", data);
    return response.data;
  }
};
