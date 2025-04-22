import {IPurchase, IPurchaseSummary} from "../../../dto/purchase/purchase-transaction";

export interface IPurchaseHandler {
    placePurchase(email: string): Promise<IPurchase>;
    getUserPurchaseHistory(email: string): Promise<IPurchaseSummary[]>;
    getPurchaseById(email: string, purchaseId: number): Promise<IPurchase>;
}
