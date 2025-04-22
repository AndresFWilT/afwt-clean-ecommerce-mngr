import { AbstractProductFetcher } from "./abstract-product-fetcher";
import { CustomError } from "../../../exception/custom-error";
import { IProductDeleter } from "../../../../domain/port/product/out/product-deleter";

export class PrismaProductDeleter extends AbstractProductFetcher implements IProductDeleter {
    async delete(id: number): Promise<void> {
        const existing = await this.fetchById(id);
        if (!existing) throw new CustomError('', 404, `Product ${id} not found`);

        await this.prisma.product.delete({ where: { id } });
    }
}
