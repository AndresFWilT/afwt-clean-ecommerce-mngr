import { PrismaClient } from "@prisma/client";

import { IProduct } from "../../../../domain/dto/product/product-handling";
import { IProductFetcherById } from "../../../../domain/port/product/out/product-fetcher-id";

export abstract class AbstractProductFetcher implements IProductFetcherById {
    protected prisma = new PrismaClient();

    async fetchById(id: number): Promise<IProduct | null> {
        const p = await this.prisma.product.findUnique({ where: { id } });
        if (!p) return null;

        return {
            id: p.id,
            name: p.name,
            description: p.description ?? '',
            price: Number(p.price),
            stock: p.stock,
        };
    }
}
