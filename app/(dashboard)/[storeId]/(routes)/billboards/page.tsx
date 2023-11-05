import React from "react";
import { BillboardCLient } from "./components/client";
import { prismadb } from "@/lib/prismadb";
import { BillboardColumns } from "./components/columns";
import { format } from "date-fns";

const Billboards = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedBillboards: BillboardColumns[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-6 pt-6">
        <BillboardCLient data={formatedBillboards} />
      </div>
    </div>
  );
};

export default Billboards;



