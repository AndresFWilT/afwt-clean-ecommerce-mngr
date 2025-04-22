import { IProductUpdater } from "../../domain/port/product/product-updater";
import { IProduct } from "../../domain/dto/product/product-handling";
import {IProductModifier} from "../../domain/port/product/product-modifier";

export class UpdateProductService implements IProductModifier {
    constructor(private readonly updater: IProductUpdater) {}

    async modify(id: number, data: IProduct): Promise<void> {
        await this.updater.update(id, data);
    }
}
