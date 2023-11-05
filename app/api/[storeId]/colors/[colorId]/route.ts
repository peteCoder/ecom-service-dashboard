import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";




export async function GET(req: Request, { params }: { params: { colorId: string } }) {
    try {
        
        if (!params.colorId) {
            return new NextResponse("Color id is required", {status: 400})
        }

        const colorExists = await prismadb.color.findFirst({
            where: {
                id: params.colorId
            }
        })

        if (!colorExists) {
            return new NextResponse("Color does not exist", { status: 404 });
        }

        const color = await prismadb.color.findFirst({
            where: {
                id: params.colorId
            }
        });

        return NextResponse.json(color);


    } catch (error) {
        console.log("[COLOR_GET]", error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function PATCH(req: Request, { params }: {params: {storeId: string, colorId: string}}) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
        }
        if (!name) {
            return new NextResponse("Name is required", {status: 400})
        }
        if (!params.storeId) {
            return new NextResponse("Store id is required", {status: 400})
        }
        if (!params.colorId) {
            return new NextResponse("Color id is required", {status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        const colorExist = await prismadb.color.findFirst({
            where: {
                id: params.colorId,
                storeId: params.storeId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorised", { status: 403 });
        }

        if (!colorExist) {
            return new NextResponse("Color does not exist", { status: 404 });
        }

        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
                storeId: params.storeId
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLOR_PATCH]", error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, colorId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("UnAuthenticated", {status: 401})
        }
        
        if (!params.storeId) {
            return new NextResponse("Store id is required", {status: 400})
        }
        if (!params.colorId) {
            return new NextResponse("Color id is required", {status: 400})
        }


        const colorExist = await prismadb.color.findFirst({
            where: {
                id: params.colorId,
                storeId: params.storeId
            }
        })

        if (!colorExist) {
            return new NextResponse("color does not exist", { status: 404});
        }

        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
                storeId: params.storeId
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLOR_DELETE]", error)
        return new NextResponse("Internal error", {status: 500})
    }
}