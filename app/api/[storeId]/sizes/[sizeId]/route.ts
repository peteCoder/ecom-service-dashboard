import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";




export async function GET(req: Request, { params }: { params: { sizeId: string } }) {
    try {
        
        if (!params.sizeId) {
            return new NextResponse("Size id is required", {status: 400})
        }

        const sizeExists = await prismadb.size.findFirst({
            where: {
                id: params.sizeId
            }
        })

        if (!sizeExists) {
            return new NextResponse("Size does not exist", { status: 404 });
        }

        const size = await prismadb.size.findFirst({
            where: {
                id: params.sizeId
            }
        });

        return NextResponse.json(size);


    } catch (error) {
        console.log("[SIZE_GET]", error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function PATCH(req: Request, { params }: {params: {storeId: string, sizeId: string}}) {
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
        if (!params.sizeId) {
            return new NextResponse("Size id is required", {status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        const sizeExist = await prismadb.size.findFirst({
            where: {
                id: params.sizeId,
                storeId: params.storeId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorised", { status: 403 });
        }

        if (!sizeExist) {
            return new NextResponse("size does not exist", { status: 204 });
        }

        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
                storeId: params.storeId
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(size);

    } catch (error) {
        console.log("[SIZE_PATCH]", error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("UnAuthenticated", {status: 401})
        }
        
        if (!params.storeId) {
            return new NextResponse("Store id is required", {status: 400})
        }
        if (!params.sizeId) {
            return new NextResponse("Size id is required", {status: 400})
        }


        const sizeExist = await prismadb.size.findFirst({
            where: {
                id: params.sizeId,
                storeId: params.storeId
            }
        })

        if (!sizeExist) {
            return new NextResponse("size does not exist", { status: 404});
        }

        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
                storeId: params.storeId
            }
        });

        return NextResponse.json(size);

    } catch (error) {
        console.log("[SIZE_DELETE]", error)
        return new NextResponse("Internal error", {status: 500})
    }
}