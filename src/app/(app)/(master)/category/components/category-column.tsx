"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, SquarePen, Trash2 } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { CATEGORY_TYPE } from "@/lib/constants";

import { deleteCategoryById } from "@/services/category-service";

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
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";

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
  const queryClient = useQueryClient();
  const [isModalEditOpen, setModalEditOpen] = useState<boolean>(false);
  const [isModalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);

  const { mutate: mutateDeleteCategory, isPending: isPendingDeleteCategory } =
    useMutation({
      mutationFn: (id: string) => deleteCategoryById(id),
      onSuccess: () => {
        toast.success("Delete category successfully.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(err?.response?.data?.message || "Delete category failed.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["getAllCategory"] });
        setModalDeleteOpen(false);
      },
    });

  return (
    <>
      <DropdownMenu modal={false}>
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
        <CategoryModal
          id={id}
          isOpen={isModalEditOpen}
          setOpen={setModalEditOpen}
        />
      )}

      {isModalDeleteOpen && (
        <ConfirmModal
          isOpen={isModalDeleteOpen}
          setOpen={setModalDeleteOpen}
          isLoading={isPendingDeleteCategory}
          title="Are you sure you want to delete it?"
          description="This action cannot be undone. This will permanently delete your category and remove your data from our servers."
          confirmBtnLabel="Delete"
          confirmBtnClassName={buttonVariants({ variant: "destructive" })}
          onConfirm={() => mutateDeleteCategory(id)}
        />
      )}
    </>
  );
};
