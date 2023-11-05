import React from "react";
import { ColorsClient } from "./components/client";
import { prismadb } from "@/lib/prismadb";
import { ColorColumns } from "./components/columns";
import { format } from "date-fns";

const Colors = async ({ params }: { params: { storeId: string } }) => {
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedColors: ColorColumns[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-6 pt-6">
        <ColorsClient data={formatedColors} />
      </div>
    </div>
  );
};

export default Colors;
