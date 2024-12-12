import {
  CurrencyColumn,
  DefaultColumn,
  NameColumn,
  NoColumn,
} from "@/components/data-table/table-column";
import { Badge } from "@/components/ui/badge";

export const vaultColumn = [
  NoColumn({
    accessorKey: "id",
    header: "No",
  }),
  NameColumn({
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    className: "w-auto",
  }),
  CurrencyColumn({
    accessorKey: "startingBalance",
    header: "Starting Balance",
  }),
  DefaultColumn({
    accessorKey: "status",
    header: "Status",
    className: "w-[100px]",
    cell: ({ row }) => (
      <div className="w-[100px]">
        <Badge
          className="rounded-full shadow-none"
          variant={row.getValue("status") ? "success" : "destructive"}
        >
          {row.getValue("status") ? "Active" : "Inactive"}
        </Badge>
      </div>
    ),
  }),
];
