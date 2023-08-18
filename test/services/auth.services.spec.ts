import AuthServices, { IAuthServices } from './../../src/services/auth.services';
import UserRepository from "../../src/repositories/user.repository";
import UserServices, { IUserServices } from "../../src/services/user.services"
import { SinonStub, stub } from "sinon";
import JwtServices, { IJwtServices } from '../../src/services/jwt.services';
import { expect } from 'chai';
import { LoginDto, SignupDto } from '../../src/dto/auth.dto';
import bcrypt from "bcrypt";

describe("Auth Services", function () {
    let authServices: IAuthServices;
    let userService: IUserServices;
    let jwtServices: IJwtServices;

    const userData: UserAttributes = {
        id: 1,
        name: "maged",
        email: "m@mail.com",
        password: "123456789"
    };

    beforeEach(function () {
        userService = new UserServices(new UserRepository());
        jwtServices = new JwtServices()

        authServices = new AuthServices(
            userService,
            jwtServices
        );

    })

    describe("Signup method", function () {
        let createTokenStub: SinonStub;
        let hashedPasswordStub: SinonStub;
        let createUserStub: SinonStub

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
            hashedPasswordStub = stub(bcrypt, "hash").resolves("hashedPassword")
        });

        afterEach(function () {
            createUserStub.restore()
            createTokenStub.restore();
            hashedPasswordStub.restore();
        })

        it("should return new user with access token if email is new", async function () {


            const findOneStub = stub(userService, "findOne").resolves(null);



            const signupData = await authServices.signup(signupDto)

            expect(signupData.user).to.deep.equal({
                id: 1,
                ...signupDto
            });

            expect(signupData.accessToken).to.be.equal("jwt token");
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
        let hashedPasswordStub: SinonStub

        const loginDto: LoginDto = {
            password: userData.password,
            email: userData.email
        }

        beforeEach(function () {
            findOneUserStub = stub(userService, "findOne");
            createTokenStub = stub(jwtServices, "createToken").returns("JWT Token");
            hashedPasswordStub = stub(bcrypt, "compare")
        })

        afterEach(function () {
            findOneUserStub.restore();
            createTokenStub.restore();
            hashedPasswordStub.restore()
        });


        it("Should return user data and token if user email exist and email is true", async function () {
            findOneUserStub.resolves(userData)
            hashedPasswordStub.resolves(true);

            const login = await authServices.login(loginDto);

            expect(login.user).to.deep.equal(userData);
            expect(login.accessToken).to.be.equal("JWT Token")
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
})