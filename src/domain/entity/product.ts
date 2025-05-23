import { IProduct } from "../dto/product/product-handling";

export class Product {
    constructor(private readonly data: IProduct) {}

    get id() { return this.data.id; }
    get name() { return this.data.name; }
    get description() { return this.data.description; }
    get price() { return this.data.price; }
    get stock() { return this.data.stock; }
    get imageUrl() { return this.data.imageUrl; }
    get createdAt() { return this.data.createdAt; }
    get updatedAt() { return this.data.updatedAt; }
}
