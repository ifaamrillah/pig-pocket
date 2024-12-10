import { FieldValues } from "react-hook-form";

import { FormProps } from "@/lib/types";

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
}: FormProps<T> & {
  type?: string;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
