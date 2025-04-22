export interface IPurchaseItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface IPurchase {
    id: number;
    userId: number;
    totalAmount: number;
    items: IPurchaseItem[];
    createdAt: string;
}

export interface IPurchaseSummary {
    id: number;
    totalAmount: number;
    createdAt: string;
}

