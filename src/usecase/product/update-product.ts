import { IProductUpdater } from "../../domain/port/product/out/product-updater";
import { IProduct } from "../../domain/dto/product/product-handling";
import {IProductModifier} from "../../domain/port/product/in/product-modifier";

export class UpdateProductService implements IProductModifier {
    constructor(private readonly updater: IProductUpdater) {}

    async modify(id: number, data: IProduct): Promise<void> {
        await this.updater.update(id, data);
    }
}
