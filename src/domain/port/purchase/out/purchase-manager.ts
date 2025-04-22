import {Purchase} from "../../../entity/purchase";

export interface IPurchaseManager {
    place(userId: number): Promise<Purchase>;
}
