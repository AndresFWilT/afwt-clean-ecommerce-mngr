import { PrismaClient } from '@prisma/client';

import { CustomError } from '../../../exception/custom-error';
import { IPurchaseItem } from '../../../../domain/dto/purchase/purchase-transaction';
import { IPurchaseManager } from "../../../../domain/port/purchase/out/purchase-manager";
import { Purchase } from '../../../../domain/entity/purchase';

const prisma = new PrismaClient();

export class PrismaPurchaseManager implements IPurchaseManager {
    async place(userId: number): Promise<Purchase> {
        return prisma.$transaction(async (tx) => {
            const cart = await tx.cart.findFirst({
                where: {userId},
                include: {
                    items: {
                        include: {product: true},
                    },
                },
            });

            if (!cart || cart.items.length === 0) {
                throw new CustomError('', 400, 'Cart is empty or not found');
            }

            let totalAmount = 0;
            const items: IPurchaseItem[] = [];

            for (const item of cart.items) {
                const {product, quantity} = item;

                if (product.stock < quantity) {
                    throw new CustomError('', 400, `Insufficient stock for product ${product.name}`);
                }

                totalAmount += Number(product.price) * quantity;

                items.push({
                    productId: product.id,
                    productName: product.name,
                    quantity,
                    unitPrice: Number(product.price),
                    totalPrice: Number(product.price) * quantity
                });

                await tx.product.update({
                    where: {id: product.id},
                    data: {stock: {decrement: quantity}},
                });
            }

            const purchase = await tx.purchase.create({
                data: {
                    userId,
                    totalAmount,
                    items: {
                        create: items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                        })),
                    },
                },
            });

            await tx.cartItem.deleteMany({where: {cartId: cart.id}});

            return new Purchase({
                id: purchase.id,
                userId: purchase.userId,
                totalAmount: Number(purchase.totalAmount),
                createdAt: purchase.createdAt.toISOString(),
                items,
            });
        });
    }
}
