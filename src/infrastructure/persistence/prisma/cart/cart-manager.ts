import { PrismaClient } from '@prisma/client';
import { ICartManager } from '../../../../domain/port/cart/out/cart-manager';
import { ICartItem, ICart } from '../../../../domain/dto/cart/cart-handling';
import { CustomError } from '../../../exception/custom-error';

const prisma = new PrismaClient();

export class PrismaCartManager implements ICartManager {
    async getCart(userId: number): Promise<ICart> {
        const cart = await prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        if (!cart) throw new CustomError('', 404, `Cart not found for user ${userId}`);

        const items: ICartItem[] = cart.items.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            productPrice: Number(item.product.price),
            quantity: item.quantity,
            totalPrice: Number(item.quantity) * Number(item.product.price),
        }));

        const totalAmount = items.reduce((acc, item) => acc + item.totalPrice, 0);

        return {
            id: cart.id,
            userId: cart.userId,
            items,
            totalAmount,
            createdAt: cart.createdAt.toISOString(),
            updatedAt: cart.updatedAt.toISOString(),
        };
    }

    async addItem(userId: number, productId: number, quantity: number): Promise<ICart> {
        const cart = await prisma.cart.upsert({
            where: { userId: userId },
            create: { userId },
            update: {},
        });

        await prisma.cartItem.upsert({
            where: { cartId_productId: { cartId: cart.id, productId } },
            create: { cartId: cart.id, productId, quantity },
            update: { quantity: { increment: quantity } },
        });

        return this.getCart(userId);
    }

    async updateItemQuantity(userId: number, productId: number, quantity: number): Promise<ICart> {
        const cart = await prisma.cart.findFirst({ where: { userId } });
        if (!cart) throw new CustomError('', 404, `Cart not found for user ${userId}`);

        await prisma.cartItem.update({
            where: { cartId_productId: { cartId: cart.id, productId } },
            data: { quantity },
        });

        return this.getCart(userId);
    }

    async removeItem(userId: number, productId: number): Promise<ICart> {
        const cart = await prisma.cart.findFirst({ where: { userId } });
        if (!cart) throw new CustomError('', 404, `Cart not found for user ${userId}`);

        await prisma.cartItem.delete({
            where: { cartId_productId: { cartId: cart.id, productId } },
        });

        return this.getCart(userId);
    }

    async clearCart(userId: number): Promise<ICart> {
        const cart = await prisma.cart.findFirst({ where: { userId } });
        if (!cart) throw new CustomError('', 404, `Cart not found for user ${userId}`);

        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

        return this.getCart(userId);
    }
}
