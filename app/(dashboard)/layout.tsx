import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export const dynamic = 'force-dynamic';

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await auth();

    if (!session) {
      redirect("/login");
    }

    return <DashboardLayout>{children}</DashboardLayout>;
  } catch (error) {
    console.error("Auth error in dashboard layout:", error);
    redirect("/login");
  }
}

