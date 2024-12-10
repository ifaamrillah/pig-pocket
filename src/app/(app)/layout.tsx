import { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import { auth } from "@/lib/auth";
import { generateFallbackName } from "@/lib/utils";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  const name = session?.user?.name || "User Not Found";
  const email = session?.user?.email || "usernotfound@mail.com";
  const avatar = session?.user?.image || "";
  const fallback = generateFallbackName(name);

  return (
    <SidebarProvider>
      <AppSidebar
        name={name}
        email={email}
        avatar={avatar}
        fallback={fallback}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
