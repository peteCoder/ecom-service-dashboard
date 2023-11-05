import { NextResponse } from "next/server";

const corsHeader = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeader });
}

export async function POST(req: Request) {
  // Validate event
  const secret = process.env.FLUTTERWAVE_SECRET_KEY as string;

  const signature = req.headers.get("verif-hash");
  // console.log("SIGNATURE", signature);
  // console.log("SECRET", secret);

  // console.log(req.headers);

  if (!signature || signature !== secret) {
    // This request isn't from Flutterwave; discard
    console.log("Something wrong happened");
    return NextResponse.json(
      { message: "Not Successfull" },
      { status: 401, headers: corsHeader }
    );
  }
  const payload = await req.json();
  // Checking the events comming in to know what action to take
  console.log(payload);
  return NextResponse.json(
    { message: "It worked", payload },
    { status: 200, headers: corsHeader }
  );
}

export async function GET(req: Request) {
  return NextResponse.json(
    { message: "Endpoint is working as expected for Flutterwave" },
    { status: 200, headers: corsHeader }
  );
}
