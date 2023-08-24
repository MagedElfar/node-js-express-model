import { stub, SinonStub } from "sinon"
import UserModel, { UserAttributes } from "./../../src/models/user.model";
import UserRepository from "./../../src/repositories/user.repository"
import { expect } from "chai";

describe("User Repository", function () {

    let userRepo: UserRepository;

    const dataValues: UserAttributes = {
        id: 1,
        name: "maged",
        email: "test@gmail.com",
        password: "123456789"
    };

    beforeEach(function () {
        userRepo = new UserRepository()
    })

    describe("create user", function () {

        let user: UserModel;
        let createUserStub: SinonStub;

        beforeEach(async function () {
            createUserStub = stub(UserModel, "create").resolves({ dataValues } as UserModel);
            user = await userRepo.create(dataValues);
        });

        afterEach(function () {
            createUserStub.restore()
        })


        it("should create new user", function () {
            expect(user).to.deep.equal(dataValues)
        });

        it("model function should calls one", function () {
            expect(createUserStub.calledOnce).to.be.true
        })
    })
})