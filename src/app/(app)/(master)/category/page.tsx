import { Metadata } from "next";

import { PageWrapper } from "@/components/page-wrapper";

import { CategoryTable } from "./components/category-table";

const breadcrumb = [
  {
    label: "Dashboard",
    href: "/",
  },
  {
    label: "Master",
  },
  {
    label: "Category",
    href: "/category",
  },
];

export const metadata: Metadata = {
  title: "Category | Pig Pocket",
  description: "...",
};

export default function CategoryPage() {
  return (
    <PageWrapper breadcrumb={breadcrumb}>
      <CategoryTable />
    </PageWrapper>
  );
}
