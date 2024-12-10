import { PageWrapper } from "@/components/page-wrapper";

const breadcrumb = [
  {
    label: "Dashboard",
    href: "/",
  },
];

export default async function DashboardPage() {
  return <PageWrapper breadcrumb={breadcrumb}>DashboardPage</PageWrapper>;
}
