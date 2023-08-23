import AuthServices, { IAuthServices } from './../../src/services/auth.services';
import UserRepository from "../../src/repositories/user.repository";
import UserServices, { IUserServices } from "../../src/services/user.services"
import { SinonStub, stub, mock, SinonMock, SinonExpectation } from "sinon";
import JwtServices, { IJwtServices } from '../../src/services/jwt.services';
import { expect } from 'chai';
import { LoginDto, SignupDto } from '../../src/dto/auth.dto';
import bcrypt from "bcrypt";
import NodeMailerServices, { IEmailServices } from '../../src/services/email.services';
import { ILogger, Logger } from '../../src/utility/logger';
import RefreshTokenServices, { IRefreshTokenServices } from '../../src/services/refreshTokwn.services';
import RefreshTokenRepository from '../../src/repositories/refreshToken.repository';
import { RefreshTokenAttributes } from '../../src/models/refreshToken.model';

describe("Auth Services", function () {
    let authServices: IAuthServices;
    let userService: IUserServices;
    let jwtServices: IJwtServices;
    let refreshTokenServices: IRefreshTokenServices;
    let emailServices: IEmailServices;
    let logger: ILogger

    const userData: UserAttributes = {
        id: 1,
        name: "maged",
        email: "m@mail.com",
        password: "123456789"
    };

    beforeEach(function () {
        userService = new UserServices(new UserRepository());
        jwtServices = new JwtServices()
        refreshTokenServices = new RefreshTokenServices(
            new RefreshTokenRepository(),
            new JwtServices()
        )
        emailServices = new NodeMailerServices()
        logger = new Logger()


        authServices = new AuthServices(
            userService,
            jwtServices,
            refreshTokenServices,
            emailServices,
            logger
        );

    })

    describe("Signup method", function () {
        let createTokenStub: SinonStub;
        let hashedPasswordStub: SinonStub;
        let createUserStub: SinonStub
        let createRefreshTokenStub: SinonStub

        const signupDto: SignupDto = {
            name: "maged",
            email: "test@mail.com",
            password: "123456789"
        }


        beforeEach(function () {
            createUserStub = stub(userService, "createUser").resolves({
                id: 1,
                ...signupDto
            });

            createTokenStub = stub(jwtServices, "createToken").returns("jwt token");
            hashedPasswordStub = stub(bcrypt, "hash").resolves("hashedPassword");
            createRefreshTokenStub = stub(refreshTokenServices, "createToken").resolves({
                id: 1,
                userId: 1,
                token: "encrypted refresh token"
            })
        });

        afterEach(function () {
            createUserStub.restore()
            createTokenStub.restore();
            hashedPasswordStub.restore();
            createRefreshTokenStub.restore()
        })

        it("should return new user with access token if email is new", async function () {

            const findOneStub = stub(userService, "findOne").resolves(null);
            const signupData = await authServices.signup(signupDto);

            expect(signupData).to.deep.equal({
                user: {
                    id: 1,
                    ...signupDto
                },
                accessToken: "jwt token",
                refreshToken: "encrypted refresh token"

            });
            expect(createUserStub.calledOnce).to.be.true
            expect(findOneStub.calledOnce).to.be.true


            createUserStub.restore();
            findOneStub.restore();
        })

        it("should throw error with 'status: 400, message: email is already used'", async function () {

            const findOneStub = stub(userService, "findOne").resolves(userData);


            try {
                const user = await authServices.signup({
                    name: userData.name,
                    email: userData.email,
                    password: "123456789"
                });


            } catch (error) {
                expect(error.status).to.be.equal(400);
                expect(error.message).to.be.equal("email is already used")
            } finally {

                expect(createUserStub.notCalled).to.be.true
                expect(createTokenStub.notCalled).to.be.true
                expect(findOneStub.calledOnce).to.be.true

                findOneStub.restore()
            }
        })
    });

    describe("login method", function () {
        let findOneUserStub: SinonStub;
        let createTokenStub: SinonStub;
        let hashedPasswordStub: SinonStub;
        let createRefreshTokenStub: SinonStub

        const loginDto: LoginDto = {
            password: userData.password,
            email: userData.email
        }

        beforeEach(function () {
            findOneUserStub = stub(userService, "findOne");
            createTokenStub = stub(jwtServices, "createToken").returns("JWT Token");
            hashedPasswordStub = stub(bcrypt, "compare")
            createRefreshTokenStub = stub(refreshTokenServices, "createToken").resolves({
                id: 1,
                userId: 1,
                token: "encrypted refresh token"
            })
        })

        afterEach(function () {
            findOneUserStub.restore();
            createTokenStub.restore();
            hashedPasswordStub.restore();
            createRefreshTokenStub.restore()
        });


        it("Should return user data and token if user email exist and email is true", async function () {
            findOneUserStub.resolves(userData)
            hashedPasswordStub.resolves(true);

            const login = await authServices.login(loginDto);

            expect(login).to.deep.equal({
                user: userData,
                accessToken: "JWT Token",
                refreshToken: "encrypted refresh token"

            });
            expect(createTokenStub.calledOnce).to.be.true;
            expect(hashedPasswordStub.calledOnce).to.be.true;
            expect(findOneUserStub.calledOnce).to.be.true
        })

        it("Should return error with status 401 if user email not exist", async function () {
            findOneUserStub.resolves(null)

            try {
                const login = await authServices.login(loginDto);
            } catch (error) {
                expect(error.status).to.be.equal(401)
            } finally {
                expect(createTokenStub.notCalled).to.be.true;
                expect(hashedPasswordStub.notCalled).to.be.true;
                expect(findOneUserStub.calledOnce).to.be.true
            }


        })

        it("Should return error with status 401 if not valid password", async function () {
            findOneUserStub.resolves(userData)
            hashedPasswordStub.resolves(false)

            try {
                const login = await authServices.login(userData);
            } catch (error) {
                expect(error.status).to.be.equal(401)
            } finally {
                expect(createTokenStub.notCalled).to.be.true;
                expect(hashedPasswordStub.calledOnce).to.be.true;
                expect(findOneUserStub.calledOnce).to.be.true
            }


        })
    })

    describe("send rest password email method", function () {
        let findOneUserStub: SinonStub;
        let createTokenStub: SinonStub;
        let sendEmailStub: SinonStub

        const loginDto: LoginDto = {
            password: userData.password,
            email: userData.email
        }

        beforeEach(function () {
            findOneUserStub = stub(userService, "findOne");
            createTokenStub = stub(jwtServices, "createToken").returns("JWT-Token");
            sendEmailStub = stub(emailServices, "send")
        })

        afterEach(function () {
            findOneUserStub.restore();
            createTokenStub.restore();
            sendEmailStub.restore()
        });


        it("should not email send if user email not exist", async function () {
            findOneUserStub.resolves(null);

            try {
                await authServices.restPasswordEmail(userData.email)
            } catch (error) {
                expect(findOneUserStub.calledOnce).to.be.true
                expect(sendEmailStub.notCalled).to.be.true
                expect(createTokenStub.notCalled).to.be.true
                expect(error.status).to.be.equal(404)
                expect(error.message).to.be.equal("doesn't user match this email")
            }
        })

        it("should email send if user email exist", async function () {
            findOneUserStub.resolves(userData);
            await authServices.restPasswordEmail(userData.email)
            expect(findOneUserStub.calledOnce).to.be.true
            expect(sendEmailStub.calledOnce).to.be.true
            expect(createTokenStub.calledOnce).to.be.true
            expect(createTokenStub.calledWith({ id: userData.id }, "15m")).to.be.true;
            expect(sendEmailStub.calledWith({
                to: userData.email,
                subject: "Forget Password",
                html: `
                <h3>Please click on the link blow to rest your password</h3>
                <a href = "/forgot-password?token=JWT-Token">Rest Password</a>
            `
            })).to.be.true
        })
    })

    describe("rest password method", function () {
        let updateUserStub: SinonStub;
        let findUserStub: SinonStub;
        let hashedPasswordStub: SinonStub;
        let jwtVerify: SinonStub;

        beforeEach(function () {
            updateUserStub = stub(userService, "updateOne")
            findUserStub = stub(userService, "findUserById")
            hashedPasswordStub = stub(bcrypt, "hash").resolves("hashed password")
            jwtVerify = stub(jwtServices, "verifyToken")
        })

        afterEach(function () {
            updateUserStub.restore();
            findUserStub.restore()
            hashedPasswordStub.restore();
            jwtVerify.restore()
        })

        it("should update password if token is valid", async function () {

            findUserStub.resolves(userData)

            updateUserStub.resolves({
                ...userData,
                password: "hashed password"
            })

            jwtVerify.returns({ id: userData.id });

            const loggerMock = mock(logger).expects("info")


            const user = await authServices.restPassword({
                password: userData.password,
                token: "token"
            })

            loggerMock.verify()

            expect(updateUserStub.calledWith(userData.id, { password: "hashed password" })).to.be.true
            expect(user).to.deep.equal({
                ...userData,
                password: "hashed password"
            })
            expect(user?.password).to.be.equal("hashed password")
        })

        it("should throw error if token is invalid", async function () {
            jwtVerify.throws({ status: 403, message: "Invalid or ExpireToken" });

            try {
                const user = await authServices.restPassword({
                    token: "invalid token",
                    password: "123456789"
                })
            } catch (error) {
                expect(error.status).to.be.equal(403)
                expect(updateUserStub.notCalled).to.be.true
            }
        })
    })

    describe("refresh token method", function () {
        let refreshTokenFindOne: SinonStub;
        let jwtVerifyTokenStub: SinonStub;
        let jwtCreateTokenStub: SinonStub;

        const refreshToken: RefreshTokenAttributes = {
            id: 1,
            userId: 1,
            token: "refresh token"
        }

        beforeEach(function () {
            refreshTokenFindOne = stub(refreshTokenServices, "findOne");
            jwtVerifyTokenStub = stub(jwtServices, "verifyToken");
            jwtCreateTokenStub = stub(jwtServices, "createToken").returns("jwt token")
        })

        afterEach(function () {
            refreshTokenFindOne.restore();
            jwtCreateTokenStub.restore();
            jwtVerifyTokenStub.restore()
        })

        it("should return new access token if refresh token valid", async function () {

            refreshTokenFindOne.resolves(refreshToken);
            jwtVerifyTokenStub.returns({ id: refreshToken.userId });

            const token = await authServices.refreshToken(refreshToken.token);

            expect(token).to.be.equal("jwt token");
            expect(jwtVerifyTokenStub.calledOnce).to.be.equal
            expect(jwtCreateTokenStub.calledOnce).to.be.equal
        })

        it("should throw error if refresh token not exist in db", async function () {

            refreshTokenFindOne.resolves(null);

            try {
                const token = await authServices.refreshToken(refreshToken.token);
            } catch (error) {
                expect(error.status).to.be.equal(401)
                expect(error.message).to.be.equal("Authentication failed. Token is invalid or expired.")
                expect(jwtVerifyTokenStub.notCalled).to.be.true
                expect(jwtCreateTokenStub.notCalled).to.be.true
            }

        })

        it("should throw error if refresh token not valid", async function () {

            refreshTokenFindOne.resolves(refreshToken);
            jwtVerifyTokenStub.returns(null)

            try {
                const token = await authServices.refreshToken(refreshToken.token);
            } catch (error) {
                expect(error.status).to.be.equal(401)
                expect(error.message).to.be.equal("Authentication failed. Token is invalid or expired.")
                expect(jwtVerifyTokenStub.calledOnce).to.be.true
                expect(jwtCreateTokenStub.notCalled).to.be.true
            }

        })
    })

    describe("logout method", function () {
        let refreshTokenFindOneStub: SinonStub;
        let refreshTokenDeleteOneMock: SinonExpectation;

        const refreshToken: RefreshTokenAttributes = {
            id: 1,
            userId: 1,
            token: "refresh token"
        }

        beforeEach(function () {
            refreshTokenFindOneStub = stub(refreshTokenServices, "findOne");
            refreshTokenDeleteOneMock = mock(refreshTokenServices).expects("deleteOne")
        })

        afterEach(function () {
            refreshTokenFindOneStub.restore()
        })

        it("should call delete refresh token method if token exist in DB", async function () {
            refreshTokenFindOneStub.resolves(refreshToken);

            await authServices.logout(refreshToken.token);

            expect(refreshTokenDeleteOneMock.calledOnce).to.be.true

            refreshTokenDeleteOneMock.verify();
        })

        it("shouldn't call delete refresh token method if token exist in DB", async function () {
            refreshTokenFindOneStub.resolves(null);

            await authServices.logout(refreshToken.token);

            expect(refreshTokenDeleteOneMock.notCalled).to.be.true
        })
    })
})