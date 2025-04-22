import {PrismaClient} from "@prisma/client";
import {IProductSaver} from "../../../../domain/port/product/out/product-saver";
import {IProduct} from "../../../../domain/dto/product/product-handling";

const prisma = new PrismaClient();

export class PrismaProductSaver implements IProductSaver {
    async save(data: IProduct): Promise<void> {
        await prisma.product.create({ data });
    }
}
