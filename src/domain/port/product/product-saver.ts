import {IProduct} from "../../dto/product/product-handling";

export interface IProductSaver {
    save(data: IProduct): Promise<void>;
}
