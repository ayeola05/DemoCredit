import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { FundTransferDto } from './dto/FundTransfer.dto';
import { FundWalletDto } from './dto/FundWallet.dto';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

describe('WalletController', () => {
  let controller: WalletController;
  let service: WalletService
  let usersService: UsersService

  const fakeReq = {
    user: {
      email: "test@test.com",
      userId: 1
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        {
          provide: WalletService,
          useValue: {
            findWallet: jest.fn(),
            creditWallet: jest.fn(),
            debitWallet: jest.fn(),
            createWallet: jest.fn()
        } },
        {
          provide: UsersService,
          useValue: {
            findUser: jest.fn()
        } }
      ]
    }).compile();

    controller = module.get<WalletController>(WalletController);
    service = module.get<WalletService>(WalletService);
    usersService = module.get<UsersService>(UsersService)
  });

  afterEach(() => {
    jest.clearAllMocks
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('Create Wallet', () => {
  //   it("Should create a wallet", () => {
  //     const fakeReq = {
  //       user: {
  //         email: "test@test.com",
  //         userId: 1
  //       }
  //     }
  //     jest.spyOn(service, "findWallet").mockResolvedValue([])
  //     expect(controller.createWallet(fakeReq)).resolves.toEqual([1])
  //   })
  // })

  describe("Create Wallet", () => {
    it("Should not create a wallet if user already has one", () => {
      
      jest.spyOn(service, "findWallet").mockResolvedValue([
        {
          walletId: 1,
          walletBalance: 0,
          created_at:" 2022-10-14T01:27:03.000Z",
          updated_at: "2022-10-14T01:27:03.000Z",
          userId: 1
        }
      ])

      expect(controller.createWallet(fakeReq)).rejects.toThrow(HttpException)
    })
  })

  // describe("Find Wallet", () => {
  //   it("Should get a users wallet detail", () => {
  //     const fakeReq = {
  //       user: {
  //         email: "test@test.com",
  //         userId: 1
  //       }
  //     }

  //     expect(controller.findWallet(fakeReq)).resolves.toEqual([
  //       {
  //         "walletId": 3,
  //         "walletBalance": 0,
  //         "created_at": "2022-10-14T01:27:03.000Z",
  //         "updated_at": "2022-10-14T01:27:03.000Z",
  //         "userId": 9
  //       }
  //     ])
  //   })
  // })

  // describe("Find Wallet", () => {
  //   it("Should throw an error if users dosent have a wallet", () => {

  //     expect(controller.findWallet(fakeReq)).rejects.toThrow(HttpException)
  //   })
  // })

  // describe("Fund Wallet", () => {
  //   it("Should fund a users wallet", () => {
  //    const newFundWalletDto: FundWalletDto = {
  //      amount: 100
  //    }

  //   jest.spyOn(service, "findWallet").mockResolvedValue([
  //     {
  //       "walletId": 3,
  //       "walletBalance": 0,
  //       "created_at": "2022-10-14T01:27:03.000Z",
  //       "updated_at": "2022-10-14T01:27:03.000Z",
  //       "userId": 9
  //     }
  //   ])

  //   expect(controller.fundWallet(fakeReq, newFundWalletDto)).resolves.toEqual({
  //     message: "wallet deposit successful",
  //     updatedWallet: [
  //       {
  //         "walletId": 3,
  //         "walletBalance": 100,
  //         "created_at": "2022-10-14T01:27:03.000Z",
  //         "updated_at": "2022-10-14T01:27:03.000Z",
  //         "userId": 9
  //       }
  //     ]
  //   })
  //   })
  // })

  describe("Fund Wallet", () => {
    it("Should not fund a users wallet if user dosen't have a wallet", () => {
     const newFundWalletDto: FundWalletDto = {
       amount: 100
     }

    jest.spyOn(service, "findWallet").mockResolvedValue([])

    expect(controller.fundWallet(fakeReq, newFundWalletDto)).rejects.toThrow(HttpException)
    })
  })

  // describe("Transfer Fund", () => {
  //   it('Should transfer funds successfully between users', () => {

  //     const newFundTransferDto: FundTransferDto = {
  //       amount: 100,
  //       email: "test@test.com"
  //     }

  //     jest.spyOn(service, "findWallet")
  //     jest.spyOn(usersService, "findUser")
  //     jest.spyOn(service, "debitWallet")
  //     jest.spyOn(service, "creditWallet")

  //     expect(controller.transferFund(fakeReq, newFundTransferDto)).resolves.toEqual({
  //       message: `Transfer between ${fakeReq.user.email} and ${newFundTransferDto.email} was successful`,
  //       updatedSendersWallet: [
  //         {
  //           walletId: 2,
  //           walletBalance: 50,
  //           created_at: "2022-10-13T00:40:48.000Z",
  //           updated_at: "2022-10-13T00:40:48.000Z",
  //           userId: 2
  //         }
  //       ],
  //       updatedReceipientsWallet: [
  //         {
  //           walletId: 1,
  //           walletBalance: 110,
  //           created_at: "2022-10-13T00:02:04.000Z",
  //           updated_at: "2022-10-13T00:02:04.000Z",
  //           userId: 1
  //         }
  //       ]
  //     })
  //   })
  // })

  // describe("Transfer Funds", () => {
  //   it("Shoud not tranfer funds if sender dosen't have a wallet", () => {
  //     const newFundTransferDto: FundTransferDto = {
  //       amount: 100,
  //       email: "test@test.com"
  //     }

  //     jest.spyOn(service, "findWallet").mockResolvedValue([])
  //     expect(controller.transferFund(fakeReq, newFundTransferDto)).rejects.toThrow(HttpException)
  //   })
  // })


  // describe("Withdraw Funds", () => {
  //   it("Should allow a user withdraw funds", () => {
  //     const newFundWalletDto: FundWalletDto = {
  //       amount: 100
  //     }

  //     jest.spyOn(service, "findWallet").mockResolvedValue([
  //         {
  //           walletId: 1,
  //           walletBalance: 200,
  //           created_at: "2022-10-13T00:02:04.000Z",
  //           updated_at: "2022-10-13T00:02:04.000Z",
  //           userId: 1
  //         }
  //       ])

  //     expect(controller.withdrawFund(fakeReq, newFundWalletDto)).resolves.toEqual({
  //       message: "wallet withdrawal successful",
  //       updatedWallet: [{
  //         walletId: 1,
  //         walletBalance: 100,
  //         created_at: "2022-10-13T00:02:04.000Z",
  //         updated_at: "2022-10-13T00:02:04.000Z",
  //         userId: 1
  //       }]
  //     })
  //   })
  // })


  // describe("Withdraw Funds", () => {
  //   it("Should not withdraw from an account with insufficient funds", () => {
      
  //     const newFundWalletDto: FundWalletDto = {
  //         amount: 100
  //       }

  //     jest.spyOn(service, "findWallet").mockResolvedValue([
  //       {
  //         walletId: 1,
  //         walletBalance: 0,
  //         created_at: "2022-10-13T00:02:04.000Z",
  //         updated_at: "2022-10-13T00:02:04.000Z",
  //         userId: 1
  //       }
  //     ])

  //     expect(controller.withdrawFund(fakeReq, newFundWalletDto)).rejects.toThrow(HttpException)
  //   })
  // })


});
