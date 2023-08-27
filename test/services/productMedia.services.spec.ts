import { stub, SinonStub } from 'sinon';
import { Request } from 'express';
import ProductMediaRepository from '../../src/repositories/productMedia.repository';
import CloudStorageService, { ICloudStorageService } from '../../src/services/cloudeStorge.services';
import { Logger } from '../../src/utility/logger';
import ProductMediaServices, { IProductMediaServices } from './../../src/services/productMedia.services';
import { expect } from 'chai';
import { ProductMediaAttributes } from '../../src/models/productMedia.model';

describe("product media services", function () {
    let productMediaServices: IProductMediaServices;
    let productMediaRepository: ProductMediaRepository;
    let cloudStorage: ICloudStorageService;

    beforeEach(function () {
        cloudStorage = new CloudStorageService(new Logger());
        productMediaRepository = new ProductMediaRepository();

        productMediaServices = new ProductMediaServices(
            productMediaRepository,
            cloudStorage
        )
    });

    describe("create product media", function () {
        let cloudStorageStub: SinonStub;
        let createMediaStub: SinonStub;
        let req: Request;

        const productMediaAtt: ProductMediaAttributes = {
            id: 1,
            image_url: "image.jpg",
            storage_key: "products/image.jpg",
            productId: 1,
            isMain: false
        }

        beforeEach(function () {
            cloudStorageStub = stub(cloudStorage, "upload")
            createMediaStub = stub(productMediaRepository, "create").resolves(productMediaAtt)
        })

        afterEach(function () {
            cloudStorageStub.restore();
            createMediaStub.restore()
        })

        it("should return null if no file", async function () {
            req = {
                file: null
            } as unknown as Request;

            const media = await productMediaServices.create(req, 1, false)

            expect(media).to.be.null;
            expect(createMediaStub.notCalled).to.be.true
            expect(cloudStorageStub.notCalled).to.be.true
        });

        it("create model method should not called if cloud method throw error", async function () {

            req = {
                file: {}
            } as unknown as Request;

            cloudStorageStub.throws(new Error("cloud error"));

            try {
                await productMediaServices.create(req, 1, false)
            } catch (error) {
                expect(error.message).to.equal('cloud error');
            } finally {
                expect(cloudStorageStub.calledOnce).to.be.true
                expect(createMediaStub.notCalled).to.be.true
            }
        })

        it("should return media object if file exist", async function () {
            req = {
                file: {}
            } as unknown as Request;

            cloudStorageStub.resolves({
                image_url: "image.jpg",
                storage_key: "products/image.jpg",
            });

            const media = await productMediaServices.create(req, 2, true)

            expect(media).to.deep.equal(productMediaAtt);
            expect(media?.productId).to.be.equal(productMediaAtt.productId)
            expect(media?.isMain).to.be.equal(productMediaAtt.isMain)
            expect(cloudStorageStub.calledOnce).to.be.true
            expect(createMediaStub.calledOnce).to.be.true
        })
    })
})