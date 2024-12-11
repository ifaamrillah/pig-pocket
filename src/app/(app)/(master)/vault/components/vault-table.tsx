"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { VaultModal } from "./vault-modal";

export const VaultTable = () => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      <div className="flex justify-end gap-4">
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle /> Add Vault
        </Button>
      </div>

      {isOpenModal && (
        <VaultModal isOpen={isOpenModal} setOpen={setOpenModal} />
      )}
    </>
  );
};
