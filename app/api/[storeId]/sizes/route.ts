import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(req: Request, {params } : {params: {storeId: string}} ) {
    try {

        const storeId = params.storeId; 


        if (!storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const allSizes = await prismadb.size.findMany({
            where: {
                storeId,
            }
        });

        return NextResponse.json(allSizes);

    } catch (error) {
        console.log(`[SIZES_GET]:`, error);
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

        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId,
            }
        })

        return NextResponse.json(size);

    } catch (error) {
        console.log(`[SIZES_POST]:`, error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}