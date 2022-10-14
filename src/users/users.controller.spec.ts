import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findUser: jest.fn(),
            createUser: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe("Create User", () => {
  //   it("Should create a new user", async () => {
  //     const newCreateUserDto: CreateUserDto = {
  //       firstName: "test",
  //       lastName: "user",
  //       email: "test@test.com",
  //       password: "testpassword"
  //     }
  //     jest.spyOn(service, "findUser").mockResolvedValue([])
  //     expect(controller.createUser(newCreateUserDto)).resolves.toEqual([1])
  //   })
  // });

  describe("Create User", () => {
    it("Should not create a new user if email already exists", () => {
      const newCreateUserDto: CreateUserDto = {
        firstName: "test",
        lastName: "user",
        email: "test@test.com",
        password: "testpassword"
      }
      jest.spyOn(service, "findUser").mockResolvedValue([{
        firstName: newCreateUserDto.firstName,
        lastName: newCreateUserDto.lastName,
        email: newCreateUserDto.email,
        password: newCreateUserDto.password
      }])

      expect(controller.createUser(newCreateUserDto)).rejects.toThrow(HttpException)
      
    })
  });


  describe("Get Profile",  () => {
    it("Should get a users profile", () => {
      jest.spyOn(service , "findUser").mockResolvedValue([
        {
          userId: 1,
          firstName: "test",
          lastName: "user",
          email: "test@test.com",
          password: "testpassword",
          created_at: "2022-10-13T00:32:02.000Z",
          updated_at: "2022-10-13T00:32:02.000Z"
        }
      ])

      const fakeReq = {
        user: {
          email: "test@test.com",
          userId: 1
        }
      }

      expect(controller.getProfile(fakeReq)).resolves.toEqual([
        {
          userId: 1,
          firstName: "test",
          lastName: "user",
          email: "test@test.com",
          password: "testpassword",
          created_at: "2022-10-13T00:32:02.000Z",
          updated_at: "2022-10-13T00:32:02.000Z"
        }
      ])
    })
  })

})
