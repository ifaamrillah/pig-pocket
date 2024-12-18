import { CATEGORY_TYPE } from "@/lib/constants";

import {
  BadgeColumn,
  NameColumn,
  NoColumn,
} from "@/components/data-table/table-column";

export const categoryColumn = [
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
  BadgeColumn({
    accessorKey: "type",
    header: "Type",
    options: CATEGORY_TYPE,
  }),
];
