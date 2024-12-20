"use client";

import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { TypeVaultValidator, VaultValidator } from "@/lib/validator";
import { STATUS_TYPE } from "@/lib/constants";

import {
  createVault,
  getVaultById,
  updateVaultById,
} from "@/services/vault-service";

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
import { FormCurrency } from "@/components/form/form-currency";
import { FormSelect } from "@/components/form/form-select";

interface VaultModalProps {
  id?: string;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const VaultModal = ({ id, isOpen, setOpen }: VaultModalProps) => {
  const queryClient = useQueryClient();

  const { data, isSuccess } = useQuery({
    queryKey: ["getVaultById", id],
    queryFn: () => getVaultById(id),
    enabled: !!id,
  });

  const { mutate: mutateCreateVault, isPending: isPendingCreateVault } =
    useMutation({
      mutationFn: (values: TypeVaultValidator) => createVault(values),
      onSuccess: () => {
        toast.success("Create vault successfully.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(err?.response?.data?.message || "Create vault failed.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllVault"] });
        setOpen(false);
      },
    });

  const { mutate: mutateUpdateVault, isPending: isPendingUpdateVault } =
    useMutation({
      mutationFn: (values: TypeVaultValidator) =>
        updateVaultById(id as string, values),
      onSuccess: () => {
        toast.success("Edit vault successfully.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(err?.response?.data?.message || "Edit vault failed.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllVault"] });
        setOpen(false);
      },
    });

  const form = useForm<TypeVaultValidator>({
    resolver: zodResolver(VaultValidator),
    values: {
      name: data?.data?.name || "",
      startingBalance: +data?.data?.startingBalance || 0,
      type: "TRANSACTION",
      status: data?.data?.status || "ACTIVE",
    },
  });

  const onSubmit = (values: TypeVaultValidator) => {
    if (id) {
      mutateUpdateVault(values);
    } else {
      mutateCreateVault(values);
    }
  };

  if (id && !isSuccess) return null;

  return (
    <Credenza open={isOpen} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{id ? "Edit" : "Add New"} Vault</CredenzaTitle>
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
                placeholder="Vault name"
                required
                disabled={isPendingCreateVault || isPendingUpdateVault}
              />
              <FormCurrency
                form={form}
                name="startingBalance"
                label="Starting Balance"
                required
                disabled={isPendingCreateVault || isPendingUpdateVault}
              />
              <FormSelect
                form={form}
                name="status"
                label="Status"
                options={STATUS_TYPE}
                required
                disabled={isPendingCreateVault || isPendingUpdateVault}
              />
            </form>
          </Form>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button
              variant="outline"
              disabled={isPendingCreateVault || isPendingUpdateVault}
            >
              Cancel
            </Button>
          </CredenzaClose>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPendingCreateVault || isPendingUpdateVault}
          >
            {isPendingCreateVault || isPendingUpdateVault
              ? "Saving..."
              : "Save"}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
