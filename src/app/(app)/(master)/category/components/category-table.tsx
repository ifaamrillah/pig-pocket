"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { Filter, PlusCircle } from "lucide-react";

import { getAllCategory } from "@/services/category-service";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";

import { CategoryModal } from "./category-modal";
import { categoryColumn } from "./category-column";
import { CategoryFilter, TypeCategoryFilter } from "./category-filter";

export const CategoryTable = () => {
  const [isOpenCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [isOpenFilter, setOpenFilter] = useState<boolean>(false);
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
  const [filters, setFilters] = useState<TypeCategoryFilter>({});

  const { data, isFetching } = useQuery({
    queryKey: ["getAllCategory", pagination, sorting, filters],
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
        filters,
      }),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={() => setOpenFilter(true)}>
          <Filter /> Filter
        </Button>

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

      {isOpenFilter && (
        <CategoryFilter
          isOpen={isOpenFilter}
          setOpen={setOpenFilter}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      {isOpenCreateModal && (
        <CategoryModal
          isOpen={isOpenCreateModal}
          setOpen={setOpenCreateModal}
        />
      )}
    </div>
  );
};
