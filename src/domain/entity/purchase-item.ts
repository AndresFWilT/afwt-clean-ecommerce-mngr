import { IPurchaseItem } from "../dto/purchase/purchase-transaction";

export class PurchaseItem {
    constructor(private readonly data: IPurchaseItem) {}

    get productId() { return this.data.productId }
    get productName() { return this.data.productName }
    get unitPrice() { return this.data.unitPrice }
    get quantity() { return this.data.quantity }
    get totalPrice() { return this.data.totalPrice }

    toDTO(): IPurchaseItem {
        return { ...this.data };
    }
}
