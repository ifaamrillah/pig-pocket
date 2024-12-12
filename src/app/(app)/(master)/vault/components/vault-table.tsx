"use client";

import { useState } from "react";
import { Filter, PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";

import { getAllVault } from "@/services/vault-service";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";

import { VaultModal } from "./vault-modal";
import { vaultColumn } from "./vault-column";
import { TypeVaultFilter, VaultFilter } from "./vault-filter";

export const VaultTable = () => {
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
  const [filters, setFilters] = useState<TypeVaultFilter>({});

  const { data, isFetching } = useQuery({
    queryKey: ["getAllVault", pagination, sorting, filters],
    queryFn: () =>
      getAllVault({
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
          <PlusCircle /> Add Vault
        </Button>
      </div>

      <div>
        <DataTable
          isLoading={isFetching}
          data={data?.data}
          columns={vaultColumn}
          totalData={data?.pagination?.totalData}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>

      {isOpenFilter && (
        <VaultFilter
          isOpen={isOpenFilter}
          setOpen={setOpenFilter}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      {isOpenCreateModal && (
        <VaultModal isOpen={isOpenCreateModal} setOpen={setOpenCreateModal} />
      )}
    </div>
  );
};
