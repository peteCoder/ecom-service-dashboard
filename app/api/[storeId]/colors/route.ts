import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(req: Request, {params } : {params: {storeId: string}} ) {
    try {

        const storeId = params.storeId; 


        if (!storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const allColors = await prismadb.color.findMany({
            where: {
                storeId,
            }
        });

        return NextResponse.json(allColors);

    } catch (error) {
        console.log(`[COLORS_GET]:`, error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request, {params } : {params: {storeId: string}} ) {
    try {
        const { userId } = auth();
        const body = await req.json();

        

        const { name, value } = body;

        const storeId = params.storeId; 


        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("name is required", { status: 400 });
        }
        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        if (!storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorised", { status: 403 });
        }

        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId,
            }
        })

        return NextResponse.json(color);

    } catch (error) {
        console.log(`[COLORS_POST]:`, error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}