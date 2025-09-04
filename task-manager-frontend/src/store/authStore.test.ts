import authStore from "./authStore";

describe("auth store",()=>{
  it("should load with an empty state",()=>{
    const authStore = await authStore.getState();
    expect(authStore.user).toBe(null);
    expect(authStore.token).toBe(null);
  })
})