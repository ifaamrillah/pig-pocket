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
import { Switch } from "@/components/ui/switch";

export const FormSwitch = <T extends FieldValues>({
  form,
  name,
  label,
  required,
  placeholder = "You can make it active/inactive",
  disabled,
  description,
}: FormProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <div className="flex flex-row items-center justify-between rounded-lg border p-3">
            <span className="text-[0.8rem] text-muted-foreground">
              {placeholder}
            </span>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
