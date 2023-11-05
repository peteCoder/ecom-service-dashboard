import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { prismadb as db } from "@/lib/prismadb";

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
  try {
    const {
      productIds,
      amount,
      hasPaid,
      redirectUrl: redirect_url,
      customer: { email, phoneNumber: phonenumber, address, name },
    } = await req.json();

    const tx_ref = uuidv4().split("-").join("");
    const customer_id = uuidv4().split("-").join("");

    const nameOfBusiness = "Store";
    const currency = "NGN";
    const businessLogo =
      "https://res.cloudinary.com/daf9tr3lf/image/upload/v1691106844/qxgu2bbtma4i76x55ea4.png";

    const allProducts = await db.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    // console.log(allProducts);

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref,
        amount: "50",
        currency,
        redirect_url,
        // meta: {
        //   mac_id: "mac-id-here",
        //   customer_id: address,
        // },
        customer: {
          email,
          phonenumber,
          name,
        },
        customizations: {
          // Business's name
          title: nameOfBusiness,
          // Business's logo
          logo: businessLogo,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    const data = await response.data;

    // console.log(data);

    return NextResponse.json(
      { url: data.data.link, productIds },
      { headers: corsHeader }
    );
  } catch (error) {
    console.log(error);
  }
}
