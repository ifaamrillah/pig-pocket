"use client";

import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CategoryType } from "@prisma/client";

import { CATEGORY_TYPE } from "@/lib/constants";

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

const filterValidator = z.object({
  name: z.string().optional(),
  type: z.union([z.nativeEnum(CategoryType), z.literal("")]).optional(),
});

export type TypeCategoryFilter = {
  name?: string;
  type?: CategoryType;
};

interface CategoryFilterProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  filters: TypeCategoryFilter;
  setFilters: Dispatch<SetStateAction<TypeCategoryFilter>>;
}

export const CategoryFilter = ({
  isOpen,
  setOpen,
  filters,
  setFilters,
}: CategoryFilterProps) => {
  const form = useForm({
    resolver: zodResolver(filterValidator),
    values: {
      name: filters.name || "",
      type: filters.type,
    },
  });

  const onSubmit = (values: z.infer<typeof filterValidator>) => {
    setFilters({
      name: values?.name?.length ? values.name : undefined,
      type: values.type === "" ? undefined : values.type,
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
                placeholder="Category name"
                allowClear
              />
              <FormSelect
                form={form}
                name="type"
                label="Type"
                placeholder="Select type"
                options={CATEGORY_TYPE}
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
