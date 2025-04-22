import { PrismaClient } from "@prisma/client";

import { IProduct } from "../../../../domain/dto/product/product-handling";
import { IProductFetcherAll } from "../../../../domain/port/product/out/product-fetcher";
import {AbstractProductFetcher} from "./abstract-product-fetcher";

const prisma = new PrismaClient();

export class PrismaProductFetcher extends AbstractProductFetcher implements IProductFetcherAll {
    async fetchAll(page = 1, limit = 10): Promise<IProduct[]> {
        const skip = (page - 1) * limit;
        const rawProducts = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        });

        return rawProducts.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description ?? '',
            price: Number(p.price),
            stock: p.stock,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
    }
}
