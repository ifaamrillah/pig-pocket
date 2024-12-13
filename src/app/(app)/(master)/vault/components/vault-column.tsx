"use client";
import { useState } from "react";
import { Settings, SquarePen } from "lucide-react";

import {
  ActionColumn,
  CurrencyColumn,
  DefaultColumn,
  NameColumn,
  NoColumn,
} from "@/components/data-table/table-column";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { VaultModal } from "./vault-modal";

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
        </DropdownMenuContent>
      </DropdownMenu>

      {isModalEditOpen && (
        <VaultModal
          id={id}
          isOpen={isModalEditOpen}
          setOpen={setModalEditOpen}
        />
      )}
    </>
  );
};
