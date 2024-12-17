"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CategoryModal } from "./category-modal";

export const CategoryTable = () => {
  const [isOpenCreateModal, setOpenCreateModal] = useState<boolean>(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4">
        <Button onClick={() => setOpenCreateModal(true)}>
          <PlusCircle /> Add Vault
        </Button>
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
