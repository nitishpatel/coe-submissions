import { create } from "zustand";
import type { LoginResponse, User } from "../types";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthStore = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

type AuthActions = {
  loginSuccess: (loginResponse: LoginResponse) => void
}
type Store = AuthStore & AuthActions

export const useAuthStore = create<Store>()(
  persist<Store>(
    (set, get): Store => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loginSuccess: (loginResponse) => {
        set(() => ({
          user: loginResponse.user,
          token: loginResponse.access_token,
          isAuthenticated: true
        }))
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage)
    }
  )
);