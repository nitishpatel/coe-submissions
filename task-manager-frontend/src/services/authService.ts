import type { SignupFormData } from "../schemas/SignupSchema";
import { httpService } from "./http";

export const authService = {
  register: async (data: SignupFormData) => {
    const response = await httpService.post("/auth/signup", data);
    return response.data;
  }
};
