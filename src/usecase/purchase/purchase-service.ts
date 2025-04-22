import { CustomError } from '../../infrastructure/exception/custom-error';
import { IPurchaseHandler } from '../../domain/port/purchase/in/purchase-handler';
import { IPurchaseFetcher } from '../../domain/port/purchase/out/purchase-fetcher';
import { IPurchaseManager } from '../../domain/port/purchase/out/purchase-manager';
import { IPurchase, IPurchaseSummary } from '../../domain/dto/purchase/purchase-transaction';
import { IUserFetcher } from "../../domain/port/user/authentication/out/user-fetcher";

export class PurchaseService implements IPurchaseHandler {
    constructor(
        private readonly userFetcher: IUserFetcher,
        private readonly purchaseFetcher: IPurchaseFetcher,
        private readonly purchaseManager: IPurchaseManager
    ) {}

    async placePurchase(email: string): Promise<IPurchase> {
        const user = await this.userFetcher.findByEmail(email);
        if (!user) throw new CustomError('', 404, `User with email ${email} not found`);

        const purchase = await this.purchaseManager.place(Number(user.id));
        return purchase.toDTO();
    }

    async getUserPurchaseHistory(email: string): Promise<IPurchaseSummary[]> {
        const user = await this.userFetcher.findByEmail(email);
        if (!user) throw new CustomError('', 404, `User with email ${email} not found`);

        return this.purchaseFetcher.findAllByUserId(Number(user.id));
    }

    async getPurchaseById(email: string, purchaseId: number): Promise<IPurchase> {
        const user = await this.userFetcher.findByEmail(email);
        if (!user) throw new CustomError('', 404, `User with email ${email} not found`);

        const purchase = await this.purchaseFetcher.findById(purchaseId);
        if (!purchase || purchase.userId !== Number(user.id)) {
            throw new CustomError('', 404, `Purchase not found for user ${email}`);
        }

        return purchase;
    }
}
