import { Metadata } from "next";

import { PageWrapper } from "@/components/page-wrapper";

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
  return <PageWrapper breadcrumb={breadcrumb}>Category Page</PageWrapper>;
}
