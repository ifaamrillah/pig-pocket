import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { CategoryValidator, TypeCategoryValidator } from "@/lib/validator";
import { CATEGORY_TYPE } from "@/lib/constants";

import {
  createCategory,
  getCategoryById,
  updateCateoryById,
} from "@/services/category-service";

import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";

interface CategoryModalProps {
  id?: string;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const CategoryModal = ({ id, isOpen, setOpen }: CategoryModalProps) => {
  const queryClient = useQueryClient();

  const { data, isSuccess } = useQuery({
    queryKey: ["getCategoryById", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });

  const { mutate: mutateCreateCategory, isPending: isPendingCreateCategory } =
    useMutation({
      mutationFn: (values: TypeCategoryValidator) => createCategory(values),
      onSuccess: () => {
        toast.success("Create category successfully.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(err?.response?.data?.message || "Create category failed.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllCategory"] });
        setOpen(false);
      },
    });

  const { mutate: mutateUpdateCategory, isPending: isPendingUpdateCategory } =
    useMutation({
      mutationFn: (values: TypeCategoryValidator) =>
        updateCateoryById(id as string, values),
      onSuccess: () => {
        toast.success("Edit category successfully.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(err?.response?.data?.message || "Edit category failed.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllCategory"] });
        setOpen(false);
      },
    });

  const form = useForm<TypeCategoryValidator>({
    resolver: zodResolver(CategoryValidator),
    values: {
      name: data?.data?.name || "",
      type: data?.data?.type || "EXPENSE",
    },
  });

  const onSubmit = (values: TypeCategoryValidator) => {
    if (id) {
      mutateUpdateCategory(values);
    } else {
      mutateCreateCategory(values);
    }
  };

  if (id && !isSuccess) return null;

  return (
    <Credenza open={isOpen} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{id ? "Edit" : "Add New"} Category</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 my-4"
            >
              <FormInput
                form={form}
                name="name"
                label="Name"
                placeholder="Category name"
                required
                disabled={isPendingCreateCategory || isPendingUpdateCategory}
              />
              <FormSelect
                form={form}
                name="type"
                label="Type"
                options={CATEGORY_TYPE}
                required
                disabled={isPendingCreateCategory || isPendingUpdateCategory}
              />
            </form>
          </Form>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button
              variant="outline"
              disabled={isPendingCreateCategory || isPendingUpdateCategory}
            >
              Cancel
            </Button>
          </CredenzaClose>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPendingCreateCategory || isPendingUpdateCategory}
          >
            {isPendingCreateCategory || isPendingUpdateCategory
              ? "Saving..."
              : "Save"}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
