import { Router } from 'express';

import { CartController } from '../../controller/cart/cart-controller';
import { CartManagerService } from '../../../usecase/cart/cart-manager';
import { PrismaCartManager } from '../../../infrastructure/persistence/prisma/cart/cart-manager';
import { PrismaProductFetcher } from '../../../infrastructure/persistence/prisma/product/product-fetcher';
import { PrismaUserFetcher } from '../../../infrastructure/persistence/prisma/user/user-fetcher';

const cartRouter = Router();

const cartManagerAdapter = new PrismaCartManager();
const productAdapter = new PrismaProductFetcher();
const userAdapter = new PrismaUserFetcher();

const cartService = new CartManagerService(userAdapter, productAdapter, cartManagerAdapter);
const controller = new CartController(cartService);

cartRouter.use('/cart', controller.getRouter());

export default cartRouter;
