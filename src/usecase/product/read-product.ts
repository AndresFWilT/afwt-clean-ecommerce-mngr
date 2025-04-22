import { CustomError } from "../../infrastructure/exception/custom-error";
import { IProduct } from "../../domain/dto/product/product-handling";
import { IProductFetcherAll } from "../../domain/port/product/product-fetcher";
import { IProductFetcherById } from "../../domain/port/product/product-fetcher-id";
import { IProductReader } from "../../domain/port/product/product-reader";

export interface IProductFetcher extends IProductFetcherAll, IProductFetcherById {}

export class ReadProductService implements IProductReader {
    constructor(
        private readonly productPersistence: IProductFetcher
    ) {}

    async getAll(page: number, limit: number): Promise<IProduct[]> {
        return this.productPersistence.fetchAll(page, limit);
    }

    async getById(id: number): Promise<IProduct | null> {
        const product = await this.productPersistence.fetchById(id);
        if (!product) {
            throw new CustomError('', 404, `Product with id ${id} not found`);
        }
        return product;
    }
}
