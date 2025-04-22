import {ICart} from "../../../dto/cart/cart-handling";

export interface ICartHandler {
    getCartByEmail(email: string): Promise<ICart>
    addItemToCartByEmail(email: string, productId: number, quantity: number): Promise<ICart>;
    updateItemQuantityByEmail(email: string, productId: number, quantity: number): Promise<ICart>;
    removeCartItemByEmail(email: string, productId: number): Promise<ICart>;
    clearCartByEmail(email: string): Promise<ICart>;
}
