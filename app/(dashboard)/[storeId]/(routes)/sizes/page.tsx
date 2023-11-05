import React from "react";
import { SizesClient } from "./components/client";
import { prismadb } from "@/lib/prismadb";
import { SizeColumns } from "./components/columns";
import { format } from "date-fns";

const Sizes = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedSizes: SizeColumns[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-6 pt-6">
        <SizesClient data={formatedSizes} />
      </div>
    </div>
  );
};

export default Sizes;
