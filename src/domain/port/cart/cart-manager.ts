import {ICart} from "../../dto/cart/cart-handling";

export interface ICartManager {
    getCart(userId: number): Promise<ICart>;
    addItem(userId: number, productId: number, quantity: number): Promise<ICart>;
    updateItemQuantity(userId: number, productId: number, quantity: number): Promise<ICart>;
    removeItem(userId: number, productId: number): Promise<ICart>;
    clearCart(userId: number): Promise<ICart>;
}
