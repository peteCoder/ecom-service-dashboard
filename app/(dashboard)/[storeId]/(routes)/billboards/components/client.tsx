"use client";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumns, columns } from "./columns";
import { DataTable } from "./data-table";
import ApiList from "@/components/ui/apiList";

interface BillboardCLientProps {
  data: BillboardColumns[];
}

export const BillboardCLient = ({ data }: BillboardCLientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboard (${data.length})`}
          description="Manage billboards for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable searchKey="label" columns={columns} data={data} />

      <Heading title={`API`} description="API calls for billboards" />
      <Separator />
      <ApiList entitiyName="billboards" entityIdName={`billboardId`} />
    </>
  );
};
