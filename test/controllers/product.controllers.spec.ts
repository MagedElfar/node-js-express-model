import { ProductController } from './../../src/controllers/product.controllers';
import { SinonStub, stub, mock, assert, SinonMock } from 'sinon';
import { NextFunction, Request, Response } from "express"
import { ILogger, Logger } from '../../src/utility/logger';
import { expect } from 'chai';
import ProductServices, { IProductServices } from '../../src/services/product.services';
import ProductMediaServices, { IProductMediaServices } from '../../src/services/productMedia.services';
import ProductRepository from '../../src/repositories/product.repository';
import ProductMediaRepository from '../../src/repositories/productMedia.repository';
import CloudStorageService from '../../src/services/cloudeStorge.services';
import { CreateProductDto } from '../../src/dto/product.dto';
import { UserAttributes } from '../../src/models/user.model';
import { ProductMediaAttributes } from '../../src/models/productMedia.model';

describe("Product Controller", function () {
    let productController: ProductController;
    let productServices: IProductServices;
    let productMediaServices: IProductMediaServices;

    this.beforeAll(function () {
        productServices = new ProductServices(new ProductRepository())

        productMediaServices = new ProductMediaServices(
            new ProductMediaRepository(),
            new CloudStorageService(new Logger())
        )

        productController = new ProductController(productServices, productMediaServices)
    })

    describe("create product Handler", function () {
        let req: Request,
            res: Response,
            next: NextFunction,
            createProductStub: SinonStub,
            findProductByIdStub: SinonStub;


        const createProductDto: CreateProductDto = {
            name: "product name",
            description: "product description",
            userId: 1
        };

        const user: Partial<UserAttributes> = {
            id: 1,
            email: "user@mail.com",
            name: "test user"
        }

        const media: Partial<ProductMediaAttributes> = {
            id: 1,
            image_url: "test.jps",
            storage_key: "key",
            productId: 2
        }

        beforeEach(function () {
            req = {
                body: createProductDto
            } as unknown as Request;

            res = {
                status: stub().returnsThis() as SinonStub,
                json: stub()
            } as unknown as Response;

            next = stub() as unknown as NextFunction;

            createProductStub = stub(productServices, "create");

            findProductByIdStub = stub(productServices, "findById")
        })

        afterEach(function () {
            findProductByIdStub.restore()
            createProductStub.restore()
        })

        it("should create new Product", async function () {

            const createProductMediaMock = mock(productMediaServices).expects("create");

            createProductStub.resolves({
                id: 2,
                ...createProductDto
            })

            findProductByIdStub.resolves({
                id: 2,
                ...createProductDto,
                user,
                media: [media]
            })

            await productController.createProductHandler(req, res, next)

            createProductMediaMock.verify()

            assert.calledWith(res.json as SinonStub, {
                type: 'success',
                product: {
                    id: 2,
                    ...createProductDto,
                    user,
                    media: [media]
                },
            })

            assert.calledWith(res.status as SinonStub, 201)

            assert.notCalled(next as SinonStub)

        })
    })
})