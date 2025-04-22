import {IPurchase, IPurchaseSummary} from "../../../dto/purchase/purchase-transaction";

export interface IPurchaseFetcher {
    findAllByUserId(userId: number): Promise<IPurchaseSummary[]>;
    findById(purchaseId: number): Promise<IPurchase | null>;
}
