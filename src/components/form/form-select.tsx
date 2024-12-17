/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FormSelect = <T extends FieldValues>({
  form,
  name,
  label,
  required,
  placeholder = "Select option",
  disabled,
  description,
  options,
}: FormProps<T> & {
  options: { value: any; label: string }[];
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <Select
            onValueChange={(value) => {
              const selectedOption = options.find(
                (option) => option.value === value
              );
              field.onChange(selectedOption);
            }}
            defaultValue={field?.value?.value}
          >
            <FormControl>
              <SelectTrigger disabled={disabled}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
