import { Metadata } from "next";

import { PageWrapper } from "@/components/page-wrapper";

import { VaultTable } from "./components/vault-table";

const breadcrumb = [
  {
    label: "Dashboard",
    href: "/",
  },
  {
    label: "Master",
  },
  {
    label: "Vault",
    href: "/vault",
  },
];

export const metadata: Metadata = {
  title: "Vault | Pig Pocket",
  description: "...",
};

export default function VaultPage() {
  return (
    <PageWrapper breadcrumb={breadcrumb}>
      <VaultTable />
    </PageWrapper>
  );
}
