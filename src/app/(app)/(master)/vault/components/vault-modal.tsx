"use client";

import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { TypeVaultValidator, VaultValidator } from "@/lib/validator";

import { createVault } from "@/services/vault-service";

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
import { FormSwitch } from "@/components/form/form-switch";

interface VaultModalProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const VaultModal = ({ isOpen, setOpen }: VaultModalProps) => {
  const queryClient = useQueryClient();

  const form = useForm<TypeVaultValidator>({
    resolver: zodResolver(VaultValidator),
    values: {
      name: "",
      startingBalance: 0,
      status: true,
      type: "TRANSACTION",
    },
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

  const onSubmit = (values: TypeVaultValidator) => mutateCreateVault(values);

  return (
    <Credenza open={isOpen} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add New Vault</CredenzaTitle>
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
                disabled={isPendingCreateVault}
              />
              <FormCurrency
                form={form}
                name="startingBalance"
                label="Starting Balance"
                required
                disabled={isPendingCreateVault}
              />
              <FormSwitch
                form={form}
                name="status"
                label="Status"
                required
                placeholder="You can make vault active or inactive."
                disabled={isPendingCreateVault}
              />
            </form>
          </Form>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline" disabled={isPendingCreateVault}>
              Cancel
            </Button>
          </CredenzaClose>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPendingCreateVault}
          >
            {isPendingCreateVault ? "Saving..." : "Save"}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
