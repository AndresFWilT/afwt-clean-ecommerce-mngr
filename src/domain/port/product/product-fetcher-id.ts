import { IProduct } from "../../dto/product/product-handling";

export interface IProductFetcherById {
    fetchById(id: number): Promise<IProduct | null>;
}
