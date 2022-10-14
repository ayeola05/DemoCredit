import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService

  let fakeLoggedInUser = {
    token: "q1w2e3r4t5y6",
    userId: 1
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService)
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("Login", () => {
    it("Should login a user",async () => {
      const fakeReq = {
        user: {
          userId: 1,
          email: "test@email.com"
        }
      }
      jest.spyOn(service, "login").mockResolvedValue(fakeLoggedInUser)
      expect(
        await controller.login(fakeReq)).toEqual(fakeLoggedInUser)
    })
  })

})

  

