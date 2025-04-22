import { CustomError } from '../../infrastructure/exception/custom-error';
import { ICart } from '../../domain/dto/cart/cart-handling';
import { ICartHandler } from '../../domain/port/cart/cart-handler';
import { ICartManager } from '../../domain/port/cart/cart-manager';
import { IProductFetcherById } from "../../domain/port/product/product-fetcher-id";
import { IUserFetcher } from '../../domain/port/user/authentication/user-fetcher';
import { IUser } from "../../domain/entity/user";

export class CartManagerService implements ICartHandler {
    constructor(
        private readonly userFetcher: IUserFetcher,
        private readonly productFetcher: IProductFetcherById,
        private readonly cartManager: ICartManager
    ) {}

    async getCartByEmail(email: string): Promise<ICart> {
        const user = await this.userFetcher.findByEmail(email);
        if (!user) throw new CustomError('', 404, `User with email ${email} not found`);

        const cart = await this.cartManager.getCart(Number(user.id));
        if (!cart) throw new CustomError('', 404, `Cart for user ${user.id} not found`);

        return cart;
    }

    async addItemToCartByEmail(email: string, productId: number, quantity: number): Promise<ICart> {
        const user = await this.validateUserAndProduct(quantity, email, productId);

        return this.cartManager.addItem(Number(user.id), productId, quantity);
    }

    async updateItemQuantityByEmail(email: string, productId: number, quantity: number): Promise<ICart> {
        const user = await this.validateUserAndProduct(quantity, email, productId);

        return this.cartManager.updateItemQuantity(Number(user.id), productId, quantity);
    }

    async removeCartItemByEmail(email: string, productId: number): Promise<ICart> {
        const user = await this.userFetcher.findByEmail(email);
        if (!user) throw new CustomError('', 404, `User with email ${email} not found`);

        return this.cartManager.removeItem(Number(user.id), productId);
    }

    async clearCartByEmail(email: string): Promise<ICart> {
        const user = await this.userFetcher.findByEmail(email);
        if (!user) throw new CustomError('', 404, `User with email ${email} not found`);

        return this.cartManager.clearCart(Number(user.id));
    }

    private validateQuantity(quantity: number) {
        if (quantity <= 0) throw new CustomError('', 400, 'Quantity must be greater than 0');
    }

    private async validateUserAndProduct(quantity: number, email: string, productId: number): Promise<IUser> {
        this.validateQuantity(quantity);

        const user = await this.userFetcher.findByEmail(email);
        if (!user) throw new CustomError('', 404, `User with email ${email} not found`);

        const product = await this.productFetcher.fetchById(productId);
        if (!product) throw new CustomError('', 404, `Product with ID ${productId} not found`);

        if (product.stock < quantity) {
            throw new CustomError('', 400, `Insufficient stock for product ${product.name}`);
        }

        return user;
    }
}
