import { apiGet, apiPost } from "@/lib/axiosClient";
import { TypeVaultValidator } from "@/lib/validator";

export async function getAllVault(params?: Record<string, unknown>) {
  return await apiGet({
    url: "/vault",
    params,
  });
}

export async function createVault(data: TypeVaultValidator) {
  return await apiPost({
    url: "/vault",
    data,
  });
}
