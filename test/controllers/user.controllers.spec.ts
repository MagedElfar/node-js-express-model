import { expect } from "chai";
import { stub, assert, SinonStub } from "sinon";
import { UserController } from "./../../src/controllers/user.controllers";
import { IUserServices } from "./../../src/services/user.services";
import { NextFunction, Request, Response } from "express"
import { ILogger } from "../../src/utility/logger";
import userDIContainer from "./../../src/dependencies/user.dependencies";
import { Dependencies } from "./../../src/utility/diContainer"

describe("UserController", function () {
    let userController: UserController;
    let userServices: IUserServices;
    let logger: ILogger

    const userData = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "123456789"
    };

    beforeEach(function () {
        userServices = userDIContainer.resolve(Dependencies.UserServices)
        logger = userDIContainer.resolve(Dependencies.Logger)
        userController = userDIContainer.resolve(Dependencies.UserController)
    });

    describe("Get User By ID", function () {
        let req: Request;
        let res: Response;
        let next: NextFunction

        beforeEach(function () {
            req = {
                params: { id: "1" },
            } as unknown as Request;

            res = {
                status: stub().returnsThis() as SinonStub, // Stub the status method
                json: stub(),
            } as unknown as Response;

            next = stub() as unknown as NextFunction;

        })

        it("getUserByIdHandler should set status code to 200 for valid user ID", async function () {
            const findUserByIdStub: SinonStub = stub(userServices, "findUserById").resolves(userData)

            await userController.getUserByIdHandler(req, res, next);

            assert.calledWith(res.status as SinonStub, 200)
            assert.notCalled(next as SinonStub)
            assert.calledWith(res.json as SinonStub, {
                type: 'success',
                user: userData
            })

            findUserByIdStub.restore()

        });

        it("should throw error with status 404 when user doesn't exist", async function () {
            const findUserByIdStub: SinonStub = stub(userServices, "findUserById").resolves(null)

            await userController.getUserByIdHandler(req, res, next);

            expect(findUserByIdStub.calledOnce).to.be.true;
            assert.called(next as SinonStub)
            assert.calledWith(next as SinonStub, { status: 404, message: "user doesn't exist" })

            findUserByIdStub.restore()

        });


        it("check is service method called with right args", async function () {
            const findUserByIdStub = stub(userServices, "findUserById").resolves(userData);

            await userController.getUserByIdHandler(req, res, next)

            expect(findUserByIdStub.calledWith(userData.id)).to.be.true

            findUserByIdStub.restore()
        })
    })
});
