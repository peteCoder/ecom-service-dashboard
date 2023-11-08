import { prismadb } from "@/lib/prismadb";
import axios from "axios";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // Validate event
  const secret = process.env.PAYSTACK_SECRET_KEY as string;

  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(body))
    .digest("hex");

  if (hash == req.headers.get("x-paystack-signature")) {
    // Retrieve the request's body
    const payload = body;

    // Destructure all the data gotten from payload
    // Do something with payload data
    const {
      event,
      data: { status, reference, amount, gateway_response },
    } = payload;
    // Here knock yourself out 😊.
    // If Charge was indeed successful.
    if (
      status === "success" &&
      event === "charge.success" &&
      reference &&
      amount > 0 &&
      gateway_response === "Successful"
    ) {
      console.log("Yehh I have a success");
      console.log("Got an Event webhook");

      // Verify payment after recieiving the webhook from paystack
      const axiosApi = axios.create({
        baseURL: "https://api.paystack.co",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      });
      const response = await axiosApi.get(`/transaction/verify/${reference}`);

      const verifyData = response.data;
      if (
        verifyData.status === true &&
        verifyData.data.status === "success" &&
        verifyData.data.reference === reference
      ) {
        // Update payment status
        await prismadb.order.update({
          where: {
            id: reference,
            referenceId: reference,
          },
          data: {
            isPaid: true,
          },
        });

        console.log("------------ VerifyData Working... ----------");
      }
    }

    return NextResponse.json({ message: "It worked" }, { status: 200 });
  }
  // Do nothing here if the event hook was not a success.

  return NextResponse.json({ message: "Not Successfull" }, { status: 400 });
}

export async function GET(req: Request) {
  return NextResponse.json(
    { message: "Endpoint is working as expected for Paystack." },
    { status: 200 }
  );
}
