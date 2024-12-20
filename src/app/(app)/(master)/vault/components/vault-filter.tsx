"use client";

import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { StatusType } from "@prisma/client";

import { STATUS_TYPE } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";

export type TypeVaultFilter = {
  name?: string;
  status?: StatusType;
};

interface VaultFilterProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  filters: TypeVaultFilter;
  setFilters: Dispatch<SetStateAction<TypeVaultFilter>>;
}

const filterValidator = z.object({
  name: z.string().optional(),
  status: z.union([z.nativeEnum(StatusType), z.literal("")]).optional(),
});

export const VaultFilter = ({
  isOpen,
  setOpen,
  filters,
  setFilters,
}: VaultFilterProps) => {
  const form = useForm({
    resolver: zodResolver(filterValidator),
    values: {
      name: filters.name || "",
      status: filters.status,
    },
  });

  const onSubmit = (values: z.infer<typeof filterValidator>) => {
    setFilters({
      name: values?.name?.length ? values.name : undefined,
      status: values.status === "" ? undefined : values.status,
    });
    setOpen(false);
  };

  const onReset = () => {
    setFilters({});
    setOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full gap-4 py-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto p-0.5 space-y-4"
            >
              <FormInput
                form={form}
                name="name"
                label="Name"
                placeholder="Vault name"
              />
              <FormSelect
                form={form}
                name="status"
                label="Status"
                placeholder="Select status"
                options={STATUS_TYPE}
                allowClear
              />
            </form>
          </Form>
          <SheetFooter className="gap-2">
            <Button variant="outline" className="w-full" onClick={onReset}>
              Reset
            </Button>
            <Button className="w-full" onClick={form.handleSubmit(onSubmit)}>
              Apply
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
