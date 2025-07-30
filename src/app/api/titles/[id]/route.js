import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const getUserId = () => {
    const token = cookies().get("token")?.value;
    if (!token) return null;
    const decoded = verify(token, process.env.JWT_SECRET);
    return decoded.userId || decoded.id;
};


export async function PUT(req, { params }) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId || decoded.id;

        const { title } = await req.json();

        const updated = await prisma.title.updateMany({
            where: {
                id: params.id,
                userId,
            },
            data: {
                title,
            },
        });

        if (updated.count === 0) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "Title updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const userId = getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const deleted = await prisma.title.deleteMany({
        where: { id: params.id, userId },
    });

    return NextResponse.json({ message: "Deleted", deleted });
};
