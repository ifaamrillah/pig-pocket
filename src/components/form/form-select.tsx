/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { Trash2 } from "lucide-react";

import { FormProps } from "@/lib/types";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const FormSelect = <T extends FieldValues>({
  form,
  name,
  label,
  required,
  placeholder = "Select option",
  disabled,
  description,
  options,
  allowClear,
}: FormProps<T> & {
  options: { value: any; label: string }[];
  allowClear?: boolean;
}) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <Select
            open={isOpen}
            onOpenChange={setOpen}
            onValueChange={field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger disabled={disabled}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options?.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
              {allowClear && (
                <>
                  <Separator className="my-1" />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      field.onChange("");
                      setOpen(false);
                    }}
                    className="w-full text-red-500 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="size-2" />
                    <span className="text-[14px] font-normal">
                      Clear option
                    </span>
                  </Button>
                </>
              )}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
