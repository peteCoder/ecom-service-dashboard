"use client";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { OrdersColumns, columns } from "./columns";
import { DataTable } from "./data-table";
import ApiList from "@/components/ui/apiList";

interface OrdersClientProps {
  data: OrdersColumns[];
}

export const OrdersClient = ({ data }: OrdersClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data.length})`}
          description="View your orders here."
        />
      </div>
      <Separator />

      <DataTable searchKey="products" columns={columns} data={data} />

      <Heading title={`API`} description="API calls for orders" />
      <Separator />
      <ApiList entitiyName="orders" entityIdName={`orderId`} />
    </>
  );
};
