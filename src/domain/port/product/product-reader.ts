import { IProduct } from "../../dto/product/product-handling";

export interface IProductReader {
    getAll(page: number, limit: number): Promise<IProduct[]>;
    getById(id: number): Promise<IProduct | null>;
}
