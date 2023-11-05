import React from "react";
import { OrdersClient } from "./components/client";
import { prismadb } from "@/lib/prismadb";
import { OrdersColumns } from "./components/columns";
import { format } from "date-fns";
import { priceFomatter } from "@/lib/utils";

// 7: 24: 00

const Orders = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedOrders: OrdersColumns[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((item) => item.product.name).join(", "),
    totalPrice: priceFomatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-6 pt-6">
        <OrdersClient data={formatedOrders} />
      </div>
    </div>
  );
};

export default Orders;
