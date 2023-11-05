import axios from "axios";
import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";
import { v4 as uuidv4 } from "uuid";

const corsHeader = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeader });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds, amount, hasPaid, redirectUrl, customer } =
    await req.json();

  const otherDetails = JSON.stringify({
    productIds,
    hasPaid,
    redirectUrl,
    customer,
  });

  const data = {
    email: customer.email,
    amount: amount * 100,
    metadata: otherDetails,
  };

  const axiosApi = axios.create({
    baseURL: "https://api.paystack.co",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });
  const response = await axiosApi.post("/transaction/initialize", data);

  const derivedData = response.data;
  if (response.status === 200) {
    console.log(derivedData.data.reference);

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const allOrders = products.map((product) => ({
      // All product attributes
      productId: product.id,
    }));

    await prismadb.order.create({
      data: {
        id: derivedData.data.reference,
        storeId: params.storeId,
        phone: customer.phoneNumber,
        address: customer.address,
        referenceId: derivedData.data.reference,
        orderItems: {
          createMany: {
            data: allOrders,
          },
        },
      },
    });


  }

  return NextResponse.json(derivedData, { status: 200, headers: corsHeader });
}
