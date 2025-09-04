import {create} from "zustand";
import type { User } from "../types";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthStore = {
  user: User | null;
  token: string|null;
}

type Store = AuthStore

export const useAuthStore = create<Store>()(
  persist<Store>(
    (set,get):Store=>({
      user:null,
      token:null
    }),
    {
      name:"auth-store",
      storage:createJSONStorage(()=>localStorage)
    }
  )
);