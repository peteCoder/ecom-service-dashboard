import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

import { redirect } from "next/navigation";

interface SetUpLayoutProps {
  children: React.ReactNode;
}

export default async function SetUpLayout({ children }: SetUpLayoutProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
