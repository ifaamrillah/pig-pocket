/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface ColumnProps extends Omit<ColumnDef<any>, "cell" | "meta"> {
  accessorKey: string;
  rowValue?: string;
  className?: string;
  cell?: ({ row }: { row: any }) => React.ReactNode;
}

export const NoColumn = ({
  accessorKey,
  className,
  ...props
}: ColumnProps): ColumnDef<any> => {
  const defaultClassName = cn("w-[60px] !important", className);

  return {
    accessorKey,
    cell: ({ row }) => <div className={defaultClassName}>{row.index + 1}</div>,
    meta: { className: defaultClassName },
    ...props,
  };
};

export const NameColumn = ({
  accessorKey,
  rowValue,
  className,
  ...props
}: ColumnProps): ColumnDef<any> => {
  const defaultClassName = cn("w-[250px]", className);
  const value = rowValue || accessorKey;

  return {
    accessorKey,
    cell: ({ row }) => (
      <div className={defaultClassName}>{row.getValue(value)}</div>
    ),
    meta: { className: defaultClassName },
    ...props,
  };
};

export const CurrencyColumn = ({
  accessorKey,
  rowValue,
  className,
  ...props
}: ColumnProps): ColumnDef<any> => {
  const defaultClassName = cn("w-[200px]", className);
  const value = rowValue || accessorKey;

  return {
    accessorKey,
    cell: ({ row }) => {
      const startingBalance = parseFloat(row.getValue(value));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(startingBalance);

      return <div className={defaultClassName}>{formatted}</div>;
    },
    meta: { className: defaultClassName },
    ...props,
  };
};

export const BadgeColumn = ({
  accessorKey,
  rowValue,
  className,
  options,
  ...props
}: ColumnProps & {
  options: any;
}): ColumnDef<any> => {
  const defaultClassName = cn("w-[100px]", className);
  const value = rowValue || accessorKey;

  const colorMap: Record<string, string> = {
    red: "bg-red-500 hover:bg-red-500",
    green: "bg-green-500 hover:bg-green-500",
  };

  return {
    accessorKey,
    cell: ({ row }) => {
      const findBadge = options.find(
        (option: any) => option.value === row.getValue(value)
      );

      return (
        <div className={defaultClassName}>
          <Badge
            variant="custom"
            className={cn(
              "rounded-full shadow-none text-white border-transparent",
              findBadge?.color && colorMap[findBadge.color]
            )}
          >
            {findBadge?.label}
          </Badge>
        </div>
      );
    },
    meta: { className: defaultClassName },
    ...props,
  };
};

export const StatusColumn = ({
  accessorKey,
  rowValue,
  valueChecker,
  className,
  ...props
}: ColumnProps & {
  valueChecker: {
    active?: any;
    inactive?: any;
  };
}): ColumnDef<any> => {
  const defaultClassName = cn("w-[60px]", className);
  const value = rowValue || accessorKey;

  const { active, inactive } = valueChecker;

  const valueMap = new Map([
    [active, { Icon: Check, className: "text-green-500" }],
    [inactive, { Icon: X, className: "text-red-500" }],
  ]);

  return {
    accessorKey,
    cell: ({ row }) => {
      const cellValue = row.getValue(value);
      const { Icon, className: iconClassName } = valueMap.get(cellValue) || {
        Icon: null,
        colorClass: "",
      };

      return (
        <div className={defaultClassName}>
          {Icon && <Icon className={cn("size-5", iconClassName)} />}
        </div>
      );
    },

    meta: { className: defaultClassName },
    ...props,
  };
};

export const DefaultColumn = ({
  accessorKey,
  className,
  ...props
}: ColumnProps): ColumnDef<any> => {
  const defaultClassName = cn("w-[150px]", className);

  return {
    accessorKey,
    meta: { className: defaultClassName },
    ...props,
  };
};

export const ActionColumn = ({
  accessorKey,
  className,
  ...props
}: ColumnProps): ColumnDef<any> => {
  const defaultClassName = cn("w-[60px]", className);

  return {
    accessorKey,
    meta: { className: defaultClassName },
    ...props,
  };
};
