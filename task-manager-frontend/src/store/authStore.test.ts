import {useAuthStore} from "./authStore";

describe("auth store",()=>{
  it("should load with an empty state",()=>{
    const authStore = useAuthStore.getState();
    expect(authStore.user).toBe(null);
    expect(authStore.token).toBe(null);
  })
  it("isAuthenticated should be set to false initally",()=>{
    const authStore = useAuthStore.getState();
    expect(authStore.isAuthenticated).toBe(false);
  });
})