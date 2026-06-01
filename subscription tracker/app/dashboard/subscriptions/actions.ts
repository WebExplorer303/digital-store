"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma" // Import your prisma instance
import { auth } from "@clerk/nextjs/server"

export async function addSubscription(prevState: any, formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        return { error: "Unauthorized" };
    }

    const payload = {
        name: (formData.get("name") as string)?.trim(),
        cost: parseFloat(formData.get("cost") as string) || 0,
        cycle: formData.get("cycle") as string,
        nextRenewal: formData.get("nextRenewal") as string,
        userId
    }

    if (!payload.name || !payload.nextRenewal) {
        return { error: "Missing required fields" };
    }

    try {
        // Use Prisma's .create() method directly
        await prisma.product.create({
            data: {
                name: payload.name,
                cost: payload.cost,
                cycle: payload.cycle,
                nextRenewal: payload.nextRenewal,
                userId: payload.userId,
            }
        });

        revalidatePath("/dashboard/subscriptions")
        revalidatePath("/dashboard")
        return { success: "Subscription added successfully!" };
    } catch (error) {
        console.error("Failed to save:", error)
        return { error: "Database operation failed" };
    }
}

export async function EditSubscription(prevState: any, formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        return { error: "Unauthorized" };
    }

    const payload = {
        name: (formData.get("name") as string)?.trim(),
        cost: parseFloat(formData.get("cost") as string) || 0,
        cycle: formData.get("cycle") as string,
        nextRenewal: formData.get("nextRenewal") as string,
        id: formData.get("id") as string,
        userId
    }

    if (!payload.name || !payload.nextRenewal) {
        return { error: "Missing required fields" };
    }

    try {
await prisma.product.update({
    where: {
        id: payload.id, 
    },
    data: {
        name: payload.name,
        cost: payload.cost,
        cycle: payload.cycle,
        nextRenewal: payload.nextRenewal,
    }
});

        revalidatePath("/dashboard/subscriptions")
        revalidatePath("/dashboard")
        return { success: "Subscription added successfully!" };
    } catch (error) {
        console.error("Failed to save:", error)
        return { error: "Database operation failed" };
    }
}

export async function DeleteSubscription(id: string) {
    const { userId } = await auth();
    
    if (!userId) throw new Error("Unauthorized");

    await prisma.product.delete({
        where: { 
            id: id,
            userId: userId 
        }
    });

    revalidatePath("/dashboard");
}


export async function checkAndRequestRenewalUpdates(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const subscriptions = await prisma.product.findMany({
    where: { userId: userId },
  });

  const overdueSubscriptions = subscriptions.filter((sub) => {
    const dateString = typeof sub.nextRenewal === "string" ? sub.nextRenewal.split("T")[0] : sub.nextRenewal;
    const renewalDate = new Date(`${dateString}T00:00:00`);
    return renewalDate < today;
  });


  if (overdueSubscriptions.length === 0) return;

  await prisma.$transaction(
    overdueSubscriptions.map((sub) => {
      const dateString = typeof sub.nextRenewal === "string" ? sub.nextRenewal.split("T")[0] : sub.nextRenewal;
      const renewalDate = new Date(`${dateString}T00:00:00`);

      while (renewalDate < today) {
        if (sub.cycle === "monthly") {
          renewalDate.setMonth(renewalDate.getMonth() + 1);
        } else if (sub.cycle === "yearly") {
          renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        }
      }

      return prisma.product.update({
        where: { id: sub.id },
        data: { nextRenewal: renewalDate.toISOString().split("T")[0] },
      });
    })
  );
}