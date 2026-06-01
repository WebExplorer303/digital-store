import { prisma } from "./prisma";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export async function getUserSubscriptions(userId: string) {
    return await prisma.product.findMany({
        where: {
            userId: userId 
        }
    });
}
