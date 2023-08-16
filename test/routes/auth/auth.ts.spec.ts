// import { expect } from 'chai';
// import { Request, Response, NextFunction } from 'express';
// import { mock, instance, when, reset } from 'ts-mockito';
// import { AuthController } from './../../../src/controllers/auth.controllers';
// import AuthServices from './../../../src/services/auth.services';
// import JwtServices from './../../../src/services/jwt.services';
// import UserRepository from './../../../src/repositories/user.repository';
// import * as authValidations from "../../../src/validations/auth.validations";
// import validationMiddleware from "../../../src/middlewares/validation.middleware";
// import { CreateUserDto } from '../../../src/dto/user.dto';

// describe('Auth Routes', () => {
//     let authController: AuthController;
//     let authService: AuthServices;
//     let jwtService: JwtServices
//     let userRepository: UserRepository;
//     let req: Request;
//     let res: Response;
//     let next: NextFunction;

//     beforeEach(() => {
//         authService = mock(AuthServices);
//         userRepository = mock(UserRepository);
//         authController = new AuthController(instance(authService));
//         req = mock<Request>();
//         res = mock<Response>();
//         next = mock<NextFunction>();
//     });

//     afterEach(() => {
//         reset(authService);
//         reset(userRepository);
//         reset(req);
//         reset(res);
//         reset(next);
//     });

//     it('should create a new user', async () => {
//         // Arrange
//         const createUserDto: CreateUserDto = {
//             name: 'testuser',
//             email: 'test@example.com',
//             password: 'testpassword',
//         };

//         const user = {
//             id: 1,
//             ...createUserDto
//         };

//         const accessToken = 'testAccessToken';


//         when(authService.signup(createUserDto)).thenReturn(Promise.resolve({ user, accessToken }));
//         when(req.body).thenReturn(createUserDto);

//         // Act
//         await authController.signUpHandler(req, res, next);

//         // Assert
//         expect(res.status).to.have.been.calledWith(201);
//         // expect(res.json).to.have.been.calledWith(createdUser);
//     });

//     // it('should handle invalid signup data', async () => {
//     //     // Arrange
//     //     const invalidCreateUserDto = {
//     //         username: 'testuser',
//     //         email: 'invalid-email', // Invalid email
//     //         password: 'short', // Invalid password
//     //     };

//     //     when(req.body).thenReturn(invalidCreateUserDto);

//     //     // Act
//     //     await authController.signUpHandler(req, res, next);

//     //     // Assert
//     //     expect(next).to.have.been.called; // Assume that the validation middleware calls the next function with an error
//     // });

//     // Add more test cases for other scenarios
// });
