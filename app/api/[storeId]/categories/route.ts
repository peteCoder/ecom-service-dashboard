import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(req: Request, {params } : {params: {storeId: string}} ) {
    try {
        const { userId } = auth();

        const storeId = params.storeId; 


        // if (!userId) {
        //     return new NextResponse("Unauthenticated", { status: 401 });
        // }

        if (!storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const categories = await prismadb.category.findMany({
            where: {
                storeId,
            }
        });

        return NextResponse.json(categories);

    } catch (error) {
        console.log(`[CATEGORIES_GET]:`, error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request, {params } : {params: {storeId: string}} ) {
    try {
        const { userId } = auth();
        const body = await req.json();

        

        const { name, billboardId } = body;

        const storeId = params.storeId; 


        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        if (!billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
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

        const categories = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId,
            }
        })

        return NextResponse.json(categories);

    } catch (error) {
        console.log(`[CATEGORIES_POST]:`, error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}