"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, SquarePen, Trash2 } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";

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
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";

import { VaultModal } from "./vault-modal";
import { deleteVaultById } from "@/services/vault-service";

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
  const queryClient = useQueryClient();
  const [isModalEditOpen, setModalEditOpen] = useState<boolean>(false);
  const [isModalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);

  const { mutate: mutateDeleteVault, isPending: isPendingVault } = useMutation({
    mutationFn: (id: string) => deleteVaultById(id),
    onSuccess: () => {
      toast.success("Delete vault successfully.");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err?.response?.data?.message || "Delete vault failed.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllVault"] });
      setModalDeleteOpen(false);
    },
  });

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
          <DropdownMenuItem
            onClick={() => setModalDeleteOpen(true)}
            className="text-red-500 cursor-pointer"
          >
            <Trash2 className="size-4" /> Delete
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

      {isModalDeleteOpen && (
        <ConfirmModal
          isOpen={isModalDeleteOpen}
          setOpen={setModalDeleteOpen}
          isLoading={isPendingVault}
          title="Are you sure you want to delete it?"
          description="This action cannot be undone. This will permanently delete your vault and remove your data from our servers."
          confirmBtnLabel="Delete"
          confirmBtnClassName={buttonVariants({ variant: "destructive" })}
          onConfirm={() => mutateDeleteVault(id)}
        />
      )}
    </>
  );
};
