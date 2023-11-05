import { UserButton, auth } from "@clerk/nextjs";
import React from "react";
import MainNav from "./mainNav";
import StoreSwitcher from "../storeSwitcher";
import { redirect } from "next/navigation";
import { prismadb } from "@/lib/prismadb";
import { ModeToggle } from "../themes/changeThemeButton";

async function Navbar() {
  const { userId, getToken } = auth();

  // const token = await getToken();
  // console.log("token", token)
  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId: userId,
    },
  });

  return (
    <div className="border-b">
      <div className="h-16 flex items-center px-4">
        {/*  */}
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
