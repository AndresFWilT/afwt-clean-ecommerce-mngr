import { PrismaClient } from '@prisma/client';

import { IPurchase, IPurchaseItem, IPurchaseSummary } from "../../../../domain/dto/purchase/purchase-transaction";
import { IPurchaseFetcher } from "../../../../domain/port/purchase/out/purchase-fetcher";

const prisma = new PrismaClient();

export class PrismaPurchaseFetcher implements IPurchaseFetcher {
    async findAllByUserId(userId: number): Promise<IPurchaseSummary[]> {
        const purchases = await prisma.purchase.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        return purchases.map((purchase) => ({
            id: purchase.id,
            totalAmount: Number(purchase.totalAmount),
            createdAt: purchase.createdAt.toISOString(),
        }));
    }

    async findById(purchaseId: number): Promise<IPurchase | null> {
        const purchase = await prisma.purchase.findUnique({
            where: { id: purchaseId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!purchase) return null;

        const items: IPurchaseItem[] = purchase.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            totalPrice: Number(item.unitPrice) * item.quantity,
        }));

        return {
            id: purchase.id,
            userId: purchase.userId,
            totalAmount: Number(purchase.totalAmount),
            createdAt: purchase.createdAt.toISOString(),
            items,
        };
    }

}
