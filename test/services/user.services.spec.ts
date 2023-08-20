import { expect } from "chai";
import { SinonStub, stub } from "sinon";
import UserServices, { IUserServices } from "./../../src/services/user.services"
import UserRepository from "../../src/repositories/user.repository";
import UserModel, { UserAttributes } from "./../../src/models/user.model";
import { func } from "joi";

describe("User Services Test", function () {

    let userRepository: UserRepository;
    let userServices: IUserServices;

    const userData: UserAttributes = {
        id: 1,
        name: "maged",
        email: "m@mail.com",
        password: "123456789"
    };

    beforeEach(function () {
        userRepository = new UserRepository();

        userServices = new UserServices(userRepository);

    })

    describe("create user", () => {

        let user: UserAttributes;
        let createUserStub: SinonStub;


        beforeEach(async function () {
            createUserStub = stub(userRepository, "create").resolves({ dataValues: userData } as UserModel);

            user = await userServices.createUser(userData);


        })

        afterEach(function () {
            createUserStub.restore()
        })

        it("should create new user", function () {
            expect(user.name).to.be.equal(userData.name)
            expect(user).to.be.equal(userData)
            expect(user).to.be.a("object")
            expect(user.email).to.be.a("string")
            expect(user.name).to.be.a("string")
            expect(user.id).to.be.a("number")
            expect(user.password).to.be.a("string")
        })

        it("test is return correct type", function () {
            expect(user).to.be.equal(userData)
            expect(user).to.be.a("object")
            expect(user.email).to.be.a("string")
            expect(user.name).to.be.a("string")
            expect(user.id).to.be.a("number")
            expect(user.password).to.be.a("string")
        })

        it("create model is called with valid args", function () {
            expect(createUserStub.calledWith(userData));
        })
    })

    describe("get user 'findOne'", function () {
        it("should return null if user not exist", async function () {
            const findUserStub = stub(userRepository, "findOne").resolves(null)

            const user = await userServices.findOne({ id: 1 })

            expect(user).to.be.equal(null)

            expect(findUserStub.calledOnce).to.be.true;

            expect(findUserStub.calledWith({
                ...userData
            }))

            findUserStub.restore()
        })
    })
})