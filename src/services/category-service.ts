import { apiGet, apiPatch, apiPost } from "@/lib/axiosClient";
import { TypeCategoryValidator } from "@/lib/validator";

export async function getAllCategory(params?: Record<string, unknown>) {
  return await apiGet({
    url: "/category",
    params,
  });
}

export async function getCategoryById(id?: string) {
  return await apiGet({
    url: `/category/${id}`,
  });
}

export async function createCategory(data: TypeCategoryValidator) {
  return await apiPost({
    url: "/category",
    data,
  });
}

export async function updateCateoryById(
  id: string,
  data: TypeCategoryValidator
) {
  return await apiPatch({
    url: `/category/${id}`,
    data,
  });
}
