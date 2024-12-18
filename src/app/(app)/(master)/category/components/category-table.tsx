"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";

import { getAllCategory } from "@/services/category-service";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";

import { CategoryModal } from "./category-modal";
import { categoryColumn } from "./category-column";

export const CategoryTable = () => {
  const [isOpenCreateModal, setOpenCreateModal] = useState<boolean>(false);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: false,
    },
  ]);

  const { data, isFetching } = useQuery({
    queryKey: ["getAllCategory", pagination, sorting],
    queryFn: () =>
      getAllCategory({
        pagination: {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
        sorting: {
          sortBy: sorting[0]?.id,
          sortDesc: sorting[0]?.desc,
        },
      }),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4">
        <Button onClick={() => setOpenCreateModal(true)}>
          <PlusCircle /> Add Category
        </Button>
      </div>

      <div>
        <DataTable
          isLoading={isFetching}
          data={data?.data}
          columns={categoryColumn}
          totalData={data?.pagination?.totalData}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>

      {isOpenCreateModal && (
        <CategoryModal
          isOpen={isOpenCreateModal}
          setOpen={setOpenCreateModal}
        />
      )}
    </div>
  );
};
