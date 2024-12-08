import { apiPost } from "@/lib/axiosClient";
import { TypeLoginValidator, TypeRegisterValidator } from "@/lib/validator";

export async function register(data: TypeRegisterValidator) {
  return await apiPost({
    url: "/register",
    data,
  });
}

export async function login(data: TypeLoginValidator) {
  return await apiPost({
    url: "/login",
    data,
  });
}
