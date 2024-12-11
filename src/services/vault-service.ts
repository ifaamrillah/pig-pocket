import { apiPost } from "@/lib/axiosClient";
import { TypeVaultValidator } from "@/lib/validator";

export async function createVault(data: TypeVaultValidator) {
  return await apiPost({
    url: "/vault",
    data,
  });
}
