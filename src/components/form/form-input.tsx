import { CircleX } from "lucide-react";
import { FieldValues } from "react-hook-form";

import { FormProps } from "@/lib/types";
import { cn } from "@/lib/utils";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const FormInput = <T extends FieldValues>({
  form,
  name,
  label,
  type = "text",
  required,
  placeholder = "Enter here",
  disabled,
  description,
  allowClear = false,
}: FormProps<T> & {
  type?: string;
  allowClear?: boolean;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              <Input
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                className={cn("pr-10", {
                  "pr-10": allowClear,
                })}
              />
              {allowClear && field.value && !disabled && (
                <button
                  type="button"
                  onClick={() => field.onChange("")}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                  <CircleX size={16} />
                </button>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
