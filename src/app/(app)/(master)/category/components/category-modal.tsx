import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { CategoryValidator, TypeCategoryValidator } from "@/lib/validator";
import { CATEGORY_TYPE } from "@/lib/constants";

import { createCategory } from "@/services/category-service";

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
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const CategoryModal = ({ isOpen, setOpen }: CategoryModalProps) => {
  const queryClient = useQueryClient();

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

  const form = useForm<TypeCategoryValidator>({
    resolver: zodResolver(CategoryValidator),
    values: {
      name: "",
      type: {
        value: "EXPENSE",
        label: "Expense",
      },
    },
  });

  const onSubmit = (values: TypeCategoryValidator) => {
    mutateCreateCategory(values);
  };

  return (
    <Credenza open={isOpen} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add New Category</CredenzaTitle>
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
                disabled={isPendingCreateCategory}
              />
              <FormSelect
                form={form}
                name="type"
                label="Type"
                options={CATEGORY_TYPE}
                required
                disabled={isPendingCreateCategory}
              />
            </form>
          </Form>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline" disabled={isPendingCreateCategory}>
              Cancel
            </Button>
          </CredenzaClose>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPendingCreateCategory}
          >
            {isPendingCreateCategory ? "Saving..." : "Save"}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
