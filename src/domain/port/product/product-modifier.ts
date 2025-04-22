import { IProduct } from "../../dto/product/product-handling";

export interface IProductModifier {
    modify(id: number, data: IProduct): Promise<void>;
}
