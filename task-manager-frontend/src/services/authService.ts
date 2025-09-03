import type { SignupFormData } from "../schemas/SignupSchema";
import type { User } from "../types";
import { httpService } from "./http";

export const authService = {
  register: async (data: SignupFormData) => {
    const response = await httpService.post<User>("/auth/signup", data);
    return response.data;
  }
};
