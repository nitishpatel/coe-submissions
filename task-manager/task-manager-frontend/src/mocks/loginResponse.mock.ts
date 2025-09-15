import type { LoginResponse } from "../types";

export const loginResponseMock:LoginResponse = {
  access_token: "dummy_jwt_token",
  token_type: "bearer",
  user: {
    id: "2bab6bc1-b938-4867-99f4-3761db08d8b9",
    email: "test@example.com",
    full_name: null,
    is_active: true,
    created_at: "2025-08-29T11:11:49.382281",
    updated_at: "2025-08-29T11:11:49.382281",
  },
}