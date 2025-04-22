import { IPurchase } from "../dto/purchase/purchase-transaction";
import {PurchaseItem} from "./purchase-item";

export class Purchase {
    private readonly items: PurchaseItem[];

    constructor(private readonly data: IPurchase) {
        this.items = data.items.map(item => new PurchaseItem(item));
    }

    get id() { return this.data.id }
    get userId() { return this.data.userId }
    get totalAmount() { return this.data.totalAmount }
    get createdAt() { return this.data.createdAt }
    get purchaseItems() { return this.items }

    toDTO(): IPurchase {
        return {
            id: this.id,
            userId: this.userId,
            totalAmount: this.totalAmount,
            createdAt: this.createdAt,
            items: this.items.map(item => item.toDTO())
        };
    }
}
