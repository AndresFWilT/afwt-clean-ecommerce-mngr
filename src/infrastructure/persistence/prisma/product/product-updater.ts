import { AbstractProductFetcher } from "./abstract-product-fetcher";
import { CustomError } from "../../../exception/custom-error";
import { IProduct } from "../../../../domain/dto/product/product-handling";
import { IProductUpdater } from "../../../../domain/port/product/out/product-updater";

export class PrismaProductUpdater extends AbstractProductFetcher implements IProductUpdater {
    async update(id: number, data: IProduct): Promise<void> {
        const existing = await this.fetchById(id);
        if (!existing) throw new CustomError('', 404, `Product ${id} not found`);

        await this.prisma.product.update({ where: { id }, data });
    }
}
