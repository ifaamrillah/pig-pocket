"use client";

import { useState } from "react";
import { Settings, SquarePen, Trash2 } from "lucide-react";

import { CATEGORY_TYPE } from "@/lib/constants";

import {
  ActionColumn,
  BadgeColumn,
  NameColumn,
  NoColumn,
} from "@/components/data-table/table-column";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { CategoryModal } from "./category-modal";

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
  ActionColumn({
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => <ActionButton id={row.getValue("id")} />,
  }),
];

const ActionButton = ({ id }: { id: string }) => {
  const [isModalEditOpen, setModalEditOpen] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <Settings className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setModalEditOpen(true)}
            className="cursor-pointer"
          >
            <SquarePen className="size-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-500 cursor-pointer">
            <Trash2 className="size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isModalEditOpen && (
        <CategoryModal
          id={id}
          isOpen={isModalEditOpen}
          setOpen={setModalEditOpen}
        />
      )}
    </>
  );
};
