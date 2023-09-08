import { SinonStub, stub, mock, assert, SinonExpectation, SinonMock } from 'sinon';
import { NextFunction, Request, Response } from "express"
import { AuthController } from '../../src/controllers/auth.controllers';
import { ILogger } from '../../src/utility/logger';
import { IAuthServices } from '../../src/services/auth.services';
import { LoginDto, SignupDto } from "../../src/dto/auth.dto";
import authDIContainer from "./../../src/dependencies/auth.dependencies";
import { Dependencies } from "./../../src/utility/diContainer"

describe("Auth Controllers", function () {
    let authController: AuthController
    let authServices: IAuthServices;
    let logger: ILogger;

    this.beforeAll(function () {
        authServices = authDIContainer.resolve(Dependencies.AuthServices)

        logger = authDIContainer.resolve(Dependencies.Logger)

        authController = authDIContainer.resolve(Dependencies.AuthController)
    })

    describe("signup Handler", function () {
        let req: Request,
            res: Response,
            next: NextFunction,
            signupStub: SinonStub,
            loggerMockUp: SinonMock;


        const signupDto: SignupDto = {
            name: "test name",
            email: "test@email.com",
            password: "12345678"
        }

        beforeEach(function () {
            req = {
                body: signupDto
            } as unknown as Request;

            res = {
                status: stub().returnsThis() as SinonStub,
                json: stub()
            } as unknown as Response;

            next = stub() as unknown as NextFunction;

            signupStub = stub(authServices, "signup");

            loggerMockUp = mock(logger)
        })

        afterEach(function () {
            signupStub.restore()
        })

        it("should return new user data with access and refresh tokens", async function () {
            signupStub.resolves({
                user: {
                    id: 1,
                    ...signupDto
                },
                accessToken: "access token",
                refreshToken: "refresh token"
            });

            loggerMockUp.expects("info")

            await authController.signUpHandler(req, res, next);

            loggerMockUp.verify();

            assert.calledWith(res.json as SinonStub, {
                type: 'success',
                user: {
                    id: 1,
                    ...signupDto
                },
                accessToken: "access token",
                refreshToken: "refresh token"
            })

            assert.calledWith(res.status as SinonStub, 201)

            assert.notCalled(next as SinonStub)

        })

        it("should should throw error 'status = 400' if email used", async function () {
            signupStub.throws({
                status: 400,
                message: "email is already used"
            })

            loggerMockUp.expects("error")

            await authController.signUpHandler(req, res, next);

            loggerMockUp.verify()

            assert.calledWith(next as SinonStub, {
                status: 400,
                message: "email is already used"
            })

            assert.notCalled(res.status as SinonStub)

            assert.notCalled(res.json as SinonStub)

        })
    })

    describe("login Handler", function () {
        let req: Request,
            res: Response,
            next: NextFunction,
            loginStub: SinonStub,
            loggerMockUp: SinonMock;


        const loginDto: LoginDto = {
            email: "test@email.com",
            password: "12345678"
        }

        beforeEach(function () {
            req = {
                body: loginDto
            } as unknown as Request;

            res = {
                status: stub().returnsThis() as SinonStub,
                json: stub()
            } as unknown as Response;

            next = stub() as unknown as NextFunction;

            loginStub = stub(authServices, "login");

            loggerMockUp = mock(logger)
        })

        afterEach(function () {
            loginStub.restore()
        })

        it("should return new user data with access and refresh tokens", async function () {
            loginStub.resolves({
                user: {
                    id: 1,
                    ...loginStub
                },
                accessToken: "access token",
                refreshToken: "refresh token"
            });


            await authController.loginHandler(req, res, next);


            assert.calledWith(res.json as SinonStub, {
                type: 'success',
                user: {
                    id: 1,
                    ...loginStub
                },
                accessToken: "access token",
                refreshToken: "refresh token"
            })

            assert.calledWith(res.status as SinonStub, 200)

            assert.notCalled(next as SinonStub)

        })

        it("should should throw error 'status = 400' if invalid credential", async function () {
            loginStub.throws({
                status: 401,
                message: "Invalid Email or Password"
            })


            await authController.loginHandler(req, res, next);

            assert.calledWith(next as SinonStub, {
                status: 401,
                message: "Invalid Email or Password"
            })

            assert.notCalled(res.status as SinonStub)

            assert.notCalled(res.json as SinonStub)

        })
    })
})