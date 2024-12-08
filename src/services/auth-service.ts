import { apiPost } from "@/lib/axiosClient";
import { TypeRegisterValidator } from "@/lib/validator";

export async function register(data: TypeRegisterValidator) {
  return await apiPost({
    url: "/register",
    data,
  });
}
