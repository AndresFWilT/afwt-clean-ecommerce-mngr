import { IProduct } from "../../../dto/product/product-handling";

export interface IProductUpdater {
    update(id: number, data: IProduct): Promise<void>;
}
