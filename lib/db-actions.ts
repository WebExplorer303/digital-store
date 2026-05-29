import { prisma } from "./prisma";




interface ProductPayload {
    name: string
    cost: number
    cycle: string
    nextRenewal: string
    userId: string
}

export async function insertProductToDatabase(data: ProductPayload) {
    return await prisma.product.create({
        data: {
            name: data.name,
            cost: data.cost,
            cycle: data.cycle,
            nextRenewal: data.nextRenewal,
            userId: data.userId
        }
    })
}

