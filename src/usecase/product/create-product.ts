import { IProduct } from "../../domain/dto/product/product-handling";
import { IProductCreator } from "../../domain/port/product/product-creator";
import { IProductSaver } from "../../domain/port/product/product-saver";

export class CreateProductService implements IProductCreator {
    constructor(private readonly productSaver: IProductSaver) {}

    async create(data: IProduct): Promise<void> {
        await this.productSaver.save(data);
    }
}
