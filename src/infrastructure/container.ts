import "reflect-metadata"
import { Container } from "inversify"

import { DeveloperRegisterUseCase } from "../application/use-cases/developer/DeveloperRegisterUseCase.ts"
import { CompanyRegisterUseCase } from "../application/use-cases/company/CompanyRegisterUseCase.ts"
import { DeveloperLoginUseCase } from "../application/use-cases/developer/DeveloperLoginUseCase.ts"
import { CompanyLoginUseCase } from "../application/use-cases/company/CompanyLoginUseCase.ts"
import { AdminLoginUseCase } from "../application/use-cases/admin/AdminLoginUseCase.ts"
import { HRLoginUseCase } from "../application/use-cases/hr/HRLoginUseCase.ts"
import { InterviewerLoginUseCase } from "../application/use-cases/interviewer/InterviewerLoginUseCase.ts"
import { VerifyOTPUseCase } from "../application/use-cases/shared/VerifyOTPUseCase.ts"
import { ResendOTPUseCase } from "../application/use-cases/shared/ResendOTPUseCase.ts"
import { LogoutUseCase } from "../application/use-cases/shared/LogoutUseCase.ts"
import { ListDevelopersUseCase } from "../application/use-cases/admin/ListDevelopersUseCase.ts"
import { ListCompaniesUseCase } from "../application/use-cases/admin/ListCompaniesUseCase.ts"
import { BlockDeveloperUseCase } from "../application/use-cases/admin/BlockDeveloperUseCase.ts"
import { UnblockDeveloperUseCase } from "../application/use-cases/admin/UnblockDeveloperUseCase.ts"
import { DeleteDeveloperUseCase } from "../application/use-cases/admin/DeleteDeveloperUseCase.ts"
import { ApproveCompanyUseCase } from "../application/use-cases/admin/ApproveCompanyUseCase.ts"
import { DeclineCompanyUseCase } from "../application/use-cases/admin/DeclineCompanyUseCase.ts"
import { BlockCompanyUseCase } from "../application/use-cases/admin/BlockCompanyUseCase.ts"
import { UnblockCompanyUseCase } from "../application/use-cases/admin/UnblockCompanyUseCase.ts"
import { AddDeveloperWarningUseCase } from "../application/use-cases/admin/AddDeveloperWarningUseCase.ts"
import { GetEntityWarningsUseCase } from "../application/use-cases/admin/GetEntityWarningsUseCase.ts"
import { GetEntityBlockHistoryUseCase } from "../application/use-cases/admin/GetEntityBlockHistoryUseCase.ts"
import { MarkWarningAsReadUseCase } from "../application/use-cases/admin/MarkWarningAsReadUseCase.ts"
import { CreateHRUseCase } from "../application/use-cases/company/CreateHRUseCase.ts"
import { EditHRUseCase } from "../application/use-cases/company/EditHRUseCase.ts"
import { DeleteHRUseCase } from "../application/use-cases/company/DeleteHRUseCase.ts"
import { BlockHRUseCase } from "../application/use-cases/company/BlockHRUseCase.ts"
import { ListHRUseCase } from "../application/use-cases/company/ListHRUseCase.ts"
import { CreateInterviewerUseCase } from "../application/use-cases/company/CreateInterviewerUseCase.ts"
import { UpdateCompanyPaymentUseCase } from "../application/use-cases/company/UpdateCompanyPaymentUseCase.ts"
 
import { RequestPasswordResetUseCase } from "../application/use-cases/auth/RequestPasswordResetUseCase.ts"
import { ConfirmPasswordResetUseCase } from "../application/use-cases/auth/ConfirmPasswordResetUseCase.ts"
import { RefreshAccessTokenUseCase } from "../application/use-cases/auth/RefreshAccessTokenUseCase.ts"
import { GoogleAuthUseCase } from "../application/use-cases/auth/GoogleAuthUseCase.ts"

import { RegisterDeveloperController } from "../interfaces/controllers/auth/RegisterDeveloperController.ts"
import { RegisterCompanyController } from "../interfaces/controllers/auth/RegisterCompanyController.ts"
import { LoginDeveloperController } from "../interfaces/controllers/auth/LoginDeveloperController.ts"
import { LoginCompanyController } from "../interfaces/controllers/auth/LoginCompanyController.ts"
import { LoginAdminController } from "../interfaces/controllers/auth/LoginAdminController.ts"
import { LoginHRController } from "../interfaces/controllers/auth/LoginHRController.ts"
import { LoginInterviewerController } from "../interfaces/controllers/auth/LoginInterviewerController.ts"
import { VerifyOTPController } from "../interfaces/controllers/auth/VerifyOTPController.ts"
import { ResendOTPController } from "../interfaces/controllers/auth/ResendOTPController.ts"
import { RequestPasswordResetController } from "../interfaces/controllers/auth/RequestPasswordResetController.ts"
import { ConfirmPasswordResetController } from "../interfaces/controllers/auth/ConfirmPasswordResetController.ts"
import { LogoutController } from "../interfaces/controllers/auth/LogoutController.ts"
import { RefreshTokenController } from "../interfaces/controllers/auth/RefreshTokenController.ts"
import { GetPasswordPolicyController } from "../interfaces/controllers/auth/GetPasswordPolicyController.ts"
import { GoogleAuthController } from "../interfaces/controllers/auth/GoogleAuthController.ts"

import { ListDevelopersController } from "../interfaces/controllers/admin/ListDevelopersController.ts"
import { ListCompaniesController } from "../interfaces/controllers/admin/ListCompaniesController.ts"
import { BlockDeveloperController } from "../interfaces/controllers/admin/BlockDeveloperController.ts"
import { UnblockDeveloperController } from "../interfaces/controllers/admin/UnblockDeveloperController.ts"
import { DeleteDeveloperController } from "../interfaces/controllers/admin/DeleteDeveloperController.ts"
import { AddDeveloperWarningController } from "../interfaces/controllers/admin/AddDeveloperWarningController.ts"
import { ApproveCompanyController } from "../interfaces/controllers/admin/ApproveCompanyController.ts"
import { DeclineCompanyController } from "../interfaces/controllers/admin/DeclineCompanyController.ts"
import { BlockCompanyController } from "../interfaces/controllers/admin/BlockCompanyController.ts"
import { UnblockCompanyController } from "../interfaces/controllers/admin/UnblockCompanyController.ts"

import { CreateHRController } from "../interfaces/controllers/company/CreateHRController.ts"
import { EditHRController } from "../interfaces/controllers/company/EditHRController.ts"
import { DeleteHRController } from "../interfaces/controllers/company/DeleteHRController.ts"
import { BlockHRController } from "../interfaces/controllers/company/BlockHRController.ts"
import { ListHRController } from "../interfaces/controllers/company/ListHRController.ts"
import { CreateInterviewerController } from "../interfaces/controllers/company/CreateInterviewerController.ts"
import { UpdateCompanyPaymentController } from "../interfaces/controllers/company/UpdateCompanyPaymentController.ts"
import { SubmitAdditionalInfoController } from "../interfaces/controllers/company/SubmitAdditionalInfoController.ts"

import { CreateDeveloperProfileUseCase } from "../application/use-cases/developer/CreateDeveloperProfileUseCase.ts"
import { GetDeveloperProfileUseCase } from "../application/use-cases/developer/GetDeveloperProfileUseCase.ts"
import { CreateDeveloperProfileController } from "../interfaces/controllers/developer/CreateDeveloperProfileController.ts"
import { GetDeveloperProfileController } from "../interfaces/controllers/developer/GetDeveloperProfileController.ts"
import type { IFileUploadService } from "../application/interfaces/services/IFileUploadService.ts"
import { FileUploadService } from "./services/FileUploadService.ts"
import type { IAdminRepository } from "../domain/repositories/IAdminRepository.ts"
import type { IDeveloperRepository } from "../domain/repositories/IDeveloperRepository.ts"
import type { ICompanyRepository } from "../domain/repositories/ICompanyRepository.ts"
import type { IHRRepository } from "../domain/repositories/IHRRepository.ts"
import type { IInterviewerRepository } from "../domain/repositories/IInterviewerRepository.ts"
import type { IWarningRepository } from "../domain/repositories/IWarningRepository.ts"
import type { IBlockHistoryRepository } from "../domain/repositories/IBlockHistoryRepository.ts"
import { AdminRepository } from "./repositories/AdminRepository.ts"
import { DeveloperRepository } from "./repositories/DeveloperRepository.ts"
import { CompanyRepository } from "./repositories/CompanyRepository.ts"
import { HRRepository } from "./repositories/HRRepository.ts"
import { InterviewerRepository } from "./repositories/InterviewerRepository.ts"
import { WarningRepository } from "./repositories/WarningRepository.ts"
import { BlockHistoryRepository } from "./repositories/BlockHistoryRepository.ts"

import type { IAuthService } from "../application/interfaces/services/IAuthService.ts"
import type { ICacheService } from "../application/interfaces/services/ICacheService.ts"
import type { IEmailService } from "../application/interfaces/services/IEmailService.ts"
import type { IOTPService } from "../application/interfaces/services/IOTPService.ts"
import { AuthService } from "./services/AuthService.ts"
import { CacheService } from "./services/CacheService.ts"
import { EmailService } from "./services/EmailService.ts"
import { OTPService } from "./services/OTPService.ts"

import { FastifyApp } from "./web/FastifyApp.ts"

const container = new Container()

container.bind<IAdminRepository>("IAdminRepository").to(AdminRepository)
container.bind<IDeveloperRepository>("IDeveloperRepository").to(DeveloperRepository)
container.bind<ICompanyRepository>("ICompanyRepository").to(CompanyRepository)
container.bind<IHRRepository>("IHRRepository").to(HRRepository)
container.bind<IInterviewerRepository>("IInterviewerRepository").to(InterviewerRepository)
container.bind<IWarningRepository>("IWarningRepository").to(WarningRepository)
container.bind<IBlockHistoryRepository>("IBlockHistoryRepository").to(BlockHistoryRepository)

container.bind<IFileUploadService>("FileUploadService").to(FileUploadService)

container.bind<IAuthService>("IAuthService").to(AuthService)
container.bind<ICacheService>("ICacheService").to(CacheService)
container.bind<IEmailService>("IEmailService").to(EmailService)
container.bind<IOTPService>("IOTPService").to(OTPService)


container.bind(DeveloperRegisterUseCase).toSelf()
container.bind(CompanyRegisterUseCase).toSelf()
container.bind(DeveloperLoginUseCase).toSelf()
container.bind(CompanyLoginUseCase).toSelf()
container.bind(AdminLoginUseCase).toSelf()
container.bind(HRLoginUseCase).toSelf()
container.bind(InterviewerLoginUseCase).toSelf()
container.bind(VerifyOTPUseCase).toSelf()
container.bind(ResendOTPUseCase).toSelf()
container.bind(LogoutUseCase).toSelf()
container.bind(ListDevelopersUseCase).toSelf()
container.bind(ListCompaniesUseCase).toSelf()
container.bind(BlockDeveloperUseCase).toSelf()
container.bind(UnblockDeveloperUseCase).toSelf()
container.bind(DeleteDeveloperUseCase).toSelf()
container.bind(AddDeveloperWarningUseCase).toSelf()
container.bind(GetEntityWarningsUseCase).toSelf()
container.bind(GetEntityBlockHistoryUseCase).toSelf()
container.bind(MarkWarningAsReadUseCase).toSelf()
container.bind(ApproveCompanyUseCase).toSelf()
container.bind(DeclineCompanyUseCase).toSelf()
container.bind(BlockCompanyUseCase).toSelf()
container.bind(UnblockCompanyUseCase).toSelf()
container.bind(CreateHRUseCase).toSelf()
container.bind(EditHRUseCase).toSelf()
container.bind(DeleteHRUseCase).toSelf()
container.bind(BlockHRUseCase).toSelf()
container.bind(ListHRUseCase).toSelf()
container.bind(CreateInterviewerUseCase).toSelf()
container.bind(UpdateCompanyPaymentUseCase).toSelf()
 
container.bind(RequestPasswordResetUseCase).toSelf()
container.bind(ConfirmPasswordResetUseCase).toSelf()
container.bind(RefreshAccessTokenUseCase).toSelf()
container.bind(GoogleAuthUseCase).toSelf()

container.bind(CreateDeveloperProfileUseCase).toSelf()
container.bind(GetDeveloperProfileUseCase).toSelf()

container.bind(RegisterDeveloperController).toSelf()
container.bind(RegisterCompanyController).toSelf()
container.bind(LoginDeveloperController).toSelf()
container.bind(LoginCompanyController).toSelf()
container.bind(LoginAdminController).toSelf()
container.bind(LoginHRController).toSelf()
container.bind(LoginInterviewerController).toSelf()
container.bind(VerifyOTPController).toSelf()
container.bind(ResendOTPController).toSelf()
container.bind(RequestPasswordResetController).toSelf()
container.bind(ConfirmPasswordResetController).toSelf()
container.bind(LogoutController).toSelf()
container.bind(RefreshTokenController).toSelf()
container.bind(GetPasswordPolicyController).toSelf()
container.bind(GoogleAuthController).toSelf()

container.bind(ListDevelopersController).toSelf()
container.bind(ListCompaniesController).toSelf()
container.bind(BlockDeveloperController).toSelf()
container.bind(UnblockDeveloperController).toSelf()
container.bind(DeleteDeveloperController).toSelf()
container.bind(AddDeveloperWarningController).toSelf()
container.bind(ApproveCompanyController).toSelf()
container.bind(DeclineCompanyController).toSelf()
container.bind(BlockCompanyController).toSelf()
container.bind(UnblockCompanyController).toSelf()

container.bind(CreateHRController).toSelf()
container.bind(EditHRController).toSelf()
container.bind(DeleteHRController).toSelf()
container.bind(BlockHRController).toSelf()
container.bind(ListHRController).toSelf()
container.bind(CreateInterviewerController).toSelf()
container.bind(UpdateCompanyPaymentController).toSelf()
container.bind(SubmitAdditionalInfoController).toSelf()

container.bind(CreateDeveloperProfileController).toSelf()
container.bind(GetDeveloperProfileController).toSelf()
container.bind("Container").toConstantValue(container)
container.bind(FastifyApp).toSelf()

export { container }
