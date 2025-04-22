export interface ICartItem {
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    totalPrice: number;
}

export interface ICart {
    id: number;
    userId: number;
    items: ICartItem[];
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}
