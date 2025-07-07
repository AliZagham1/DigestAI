import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server"

export async function POST(request: Request) {
    const {userId} = await auth();

    if (!userId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
}