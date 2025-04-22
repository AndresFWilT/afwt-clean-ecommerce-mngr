import { Router } from 'express';

import { PurchaseController } from '../../controller/purchase/purchase-controller';
import { PurchaseService } from '../../../usecase/purchase/purchase-service';
import { PrismaPurchaseFetcher } from '../../../infrastructure/persistence/prisma/purchase/purchase-fetcher';
import { PrismaPurchaseManager } from '../../../infrastructure/persistence/prisma/purchase/purchase-manager';
import { PrismaUserFetcher } from '../../../infrastructure/persistence/prisma/user/user-fetcher';

const purchaseRouter = Router();

const purchaseFetcher = new PrismaPurchaseFetcher();
const purchaseManager = new PrismaPurchaseManager();
const userFetcher = new PrismaUserFetcher();

const purchaseService = new PurchaseService(userFetcher, purchaseFetcher, purchaseManager);

const controller = new PurchaseController(purchaseService);

purchaseRouter.use('/purchases', controller.getRouter());

export default purchaseRouter;
