import { IProduct } from "../../../dto/product/product-handling";

export interface IProductCreator {
    create(data: IProduct): Promise<void>;
}
