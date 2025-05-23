import { IProductDeleter } from "../../domain/port/product/out/product-deleter";
import {IProductRemover} from "../../domain/port/product/in/product-remover";

export class DeleteProductService implements IProductRemover {
    constructor(private readonly deleter: IProductDeleter) {}

    async execute(id: number): Promise<void> {
        await this.deleter.delete(id);
    }
}
