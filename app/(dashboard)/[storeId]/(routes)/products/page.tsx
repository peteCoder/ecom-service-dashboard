import React from "react";
import { ProductClient } from "./components/client";
import { prismadb } from "@/lib/prismadb";
import { ProductColumns } from "./components/columns";
import { format } from "date-fns";
import { priceFomatter } from "@/lib/utils";

const Product = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
  });

  const formatedProducts: ProductColumns[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: priceFomatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-6 pt-6">
        <ProductClient data={formatedProducts} />
      </div>
    </div>
  );
};

export default Product;
