import { apiGet, apiPatch, apiPost } from "@/lib/axiosClient";
import { TypeVaultValidator } from "@/lib/validator";

export async function getAllVault(params?: Record<string, unknown>) {
  return await apiGet({
    url: "/vault",
    params,
  });
}

export async function getVaultById(id?: string) {
  return await apiGet({
    url: `/vault/${id}`,
  });
}

export async function createVault(data: TypeVaultValidator) {
  return await apiPost({
    url: "/vault",
    data,
  });
}

export async function updateVaultById(id: string, data: TypeVaultValidator) {
  return await apiPatch({
    url: `/vault/${id}`,
    data,
  });
}
