import { IProduct } from "../../dto/product/product-handling";

export interface IProductFetcherAll {
    fetchAll(page: number, limit: number): Promise<IProduct[]>;
}
