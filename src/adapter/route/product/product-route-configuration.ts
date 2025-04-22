import { Router } from 'express';

import { CreateProductService } from '../../../usecase/product/create-product';
import { ReadProductService } from '../../../usecase/product/read-product';
import { UpdateProductService } from '../../../usecase/product/update-product';
import { DeleteProductService } from '../../../usecase/product/delete-product';

import { PrismaProductSaver } from '../../../infrastructure/persistence/prisma/product/product-saver';
import { PrismaProductFetcher } from '../../../infrastructure/persistence/prisma/product/product-fetcher';
import { PrismaProductUpdater } from '../../../infrastructure/persistence/prisma/product/product-updater';
import { PrismaProductDeleter } from '../../../infrastructure/persistence/prisma/product/product-deleter';

import { ProductController } from '../../controller/product/product-controller';

const productRouter = Router();

const saver = new PrismaProductSaver();
const fetcher = new PrismaProductFetcher();
const updater = new PrismaProductUpdater();
const deleter = new PrismaProductDeleter();

const creator = new CreateProductService(saver);
const reader = new ReadProductService(fetcher);
const modifier = new UpdateProductService(updater);
const remover = new DeleteProductService(deleter);

const controller = new ProductController(creator, reader, modifier, remover);

productRouter.use(
    '/products',
    controller.getRouter()
);

export default productRouter;
