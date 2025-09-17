import { inject, injectable, Container } from "inversify"
import Fastify, { type FastifyInstance } from "fastify"
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import cookie from "@fastify/cookie"
import multipart from "@fastify/multipart"
import { ZodError } from "zod"
import { RegisterDeveloperController } from "../../interfaces/controllers/auth/RegisterDeveloperController.ts"
import { RegisterCompanyController } from "../../interfaces/controllers/auth/RegisterCompanyController.ts"
import { LoginDeveloperController } from "../../interfaces/controllers/auth/LoginDeveloperController.ts"
import { LoginCompanyController } from "../../interfaces/controllers/auth/LoginCompanyController.ts"
import { LoginAdminController } from "../../interfaces/controllers/auth/LoginAdminController.ts"
import { LoginHRController } from "../../interfaces/controllers/auth/LoginHRController.ts"
import { LoginInterviewerController } from "../../interfaces/controllers/auth/LoginInterviewerController.ts"
import { VerifyOTPController } from "../../interfaces/controllers/auth/VerifyOTPController.ts"
import { ResendOTPController } from "../../interfaces/controllers/auth/ResendOTPController.ts"
import { RequestPasswordResetController } from "../../interfaces/controllers/auth/RequestPasswordResetController.ts"
import { ConfirmPasswordResetController } from "../../interfaces/controllers/auth/ConfirmPasswordResetController.ts"
import { LogoutController } from "../../interfaces/controllers/auth/LogoutController.ts"
import { RefreshTokenController } from "../../interfaces/controllers/auth/RefreshTokenController.ts"
import { GetPasswordPolicyController } from "../../interfaces/controllers/auth/GetPasswordPolicyController.ts"
import { GoogleAuthController } from "../../interfaces/controllers/auth/GoogleAuthController.ts"

import { ListDevelopersController } from "../../interfaces/controllers/admin/ListDevelopersController.ts"
import { ListCompaniesController } from "../../interfaces/controllers/admin/ListCompaniesController.ts"
import { BlockDeveloperController } from "../../interfaces/controllers/admin/BlockDeveloperController.ts"
import { UnblockDeveloperController } from "../../interfaces/controllers/admin/UnblockDeveloperController.ts"
import { DeleteDeveloperController } from "../../interfaces/controllers/admin/DeleteDeveloperController.ts"
import { AddDeveloperWarningController } from "../../interfaces/controllers/admin/AddDeveloperWarningController.ts"
import { ApproveCompanyController } from "../../interfaces/controllers/admin/ApproveCompanyController.ts"
import { DeclineCompanyController } from "../../interfaces/controllers/admin/DeclineCompanyController.ts"
import { BlockCompanyController } from "../../interfaces/controllers/admin/BlockCompanyController.ts"
import { UnblockCompanyController } from "../../interfaces/controllers/admin/UnblockCompanyController.ts"

import { CreateHRController } from "../../interfaces/controllers/company/CreateHRController.ts"
import { EditHRController } from "../../interfaces/controllers/company/EditHRController.ts"
import { DeleteHRController } from "../../interfaces/controllers/company/DeleteHRController.ts"
import { BlockHRController } from "../../interfaces/controllers/company/BlockHRController.ts"
import { ListHRController } from "../../interfaces/controllers/company/ListHRController.ts"
import { CreateInterviewerController } from "../../interfaces/controllers/company/CreateInterviewerController.ts"
import { UpdateCompanyPaymentController } from "../../interfaces/controllers/company/UpdateCompanyPaymentController.ts"
import { SubmitAdditionalInfoController } from "../../interfaces/controllers/company/SubmitAdditionalInfoController.ts"

import type { IAuthService } from "../../application/interfaces/services/IAuthService.ts"
import { createAuthPreHandlersFromAuthService } from "../../interfaces/middlewares/auth.ts"
import { CreateDeveloperProfileController, GetDeveloperProfileController } from "../../interfaces/controllers/developer/index.ts"
import { DomainError } from "../../domain/errors/DomainError.ts"

@injectable()
export class FastifyApp {
  private app: FastifyInstance
  
  private registerDeveloperController: RegisterDeveloperController
  private registerCompanyController: RegisterCompanyController
  private loginDeveloperController: LoginDeveloperController
  private loginCompanyController: LoginCompanyController
  private loginAdminController: LoginAdminController
  private loginHRController: LoginHRController
  private loginInterviewerController: LoginInterviewerController
  private verifyOTPController: VerifyOTPController
  private resendOTPController: ResendOTPController
  private requestPasswordResetController: RequestPasswordResetController
  private confirmPasswordResetController: ConfirmPasswordResetController
  private logoutController: LogoutController
  private refreshTokenController: RefreshTokenController
  private getPasswordPolicyController: GetPasswordPolicyController
  private googleAuthController: GoogleAuthController

  private listDevelopersController: ListDevelopersController
  private listCompaniesController: ListCompaniesController
  private blockDeveloperController: BlockDeveloperController
  private unblockDeveloperController: UnblockDeveloperController
  private deleteDeveloperController: DeleteDeveloperController
  private addDeveloperWarningController: AddDeveloperWarningController
  private approveCompanyController: ApproveCompanyController
  private declineCompanyController: DeclineCompanyController
  private blockCompanyController: BlockCompanyController
  private unblockCompanyController: UnblockCompanyController

  private createHRController: CreateHRController
  private editHRController: EditHRController
  private deleteHRController: DeleteHRController
  private blockHRController: BlockHRController
  private listHRController: ListHRController
  private createInterviewerController: CreateInterviewerController
  private updateCompanyPaymentController: UpdateCompanyPaymentController
  private submitAdditionalInfoController: SubmitAdditionalInfoController
  

  private createDeveloperProfileController: CreateDeveloperProfileController
  private getDeveloperProfileController: GetDeveloperProfileController
  private authPreHandlers: ReturnType<typeof createAuthPreHandlersFromAuthService>

  constructor(
    @inject(RegisterDeveloperController) registerDeveloperController: RegisterDeveloperController,
    @inject(RegisterCompanyController) registerCompanyController: RegisterCompanyController,
    @inject(LoginDeveloperController) loginDeveloperController: LoginDeveloperController,
    @inject(LoginCompanyController) loginCompanyController: LoginCompanyController,
    @inject(LoginAdminController) loginAdminController: LoginAdminController,
    @inject(LoginHRController) loginHRController: LoginHRController,
    @inject(LoginInterviewerController) loginInterviewerController: LoginInterviewerController,
    @inject(VerifyOTPController) verifyOTPController: VerifyOTPController,
    @inject(ResendOTPController) resendOTPController: ResendOTPController,
    @inject(RequestPasswordResetController) requestPasswordResetController: RequestPasswordResetController,
    @inject(ConfirmPasswordResetController) confirmPasswordResetController: ConfirmPasswordResetController,
    @inject(LogoutController) logoutController: LogoutController,
    @inject(RefreshTokenController) refreshTokenController: RefreshTokenController,
    @inject(GetPasswordPolicyController) getPasswordPolicyController: GetPasswordPolicyController,
    @inject(GoogleAuthController) googleAuthController: GoogleAuthController,

    @inject(ListDevelopersController) listDevelopersController: ListDevelopersController,
    @inject(ListCompaniesController) listCompaniesController: ListCompaniesController,
    @inject(BlockDeveloperController) blockDeveloperController: BlockDeveloperController,
    @inject(UnblockDeveloperController) unblockDeveloperController: UnblockDeveloperController,
    @inject(DeleteDeveloperController) deleteDeveloperController: DeleteDeveloperController,
    @inject(AddDeveloperWarningController) addDeveloperWarningController: AddDeveloperWarningController,
    @inject(ApproveCompanyController) approveCompanyController: ApproveCompanyController,
    @inject(DeclineCompanyController) declineCompanyController: DeclineCompanyController,
    @inject(BlockCompanyController) blockCompanyController: BlockCompanyController,
    @inject(UnblockCompanyController) unblockCompanyController: UnblockCompanyController,

    @inject(CreateHRController) createHRController: CreateHRController,
    @inject(EditHRController) editHRController: EditHRController,
    @inject(DeleteHRController) deleteHRController: DeleteHRController,
    @inject(BlockHRController) blockHRController: BlockHRController,
    @inject(ListHRController) listHRController: ListHRController,
    @inject(CreateInterviewerController) createInterviewerController: CreateInterviewerController,
    @inject(UpdateCompanyPaymentController) updateCompanyPaymentController: UpdateCompanyPaymentController,
    @inject(SubmitAdditionalInfoController) submitAdditionalInfoController: SubmitAdditionalInfoController,
    

    @inject(CreateDeveloperProfileController) createDeveloperProfileController: CreateDeveloperProfileController,
    @inject(GetDeveloperProfileController) getDeveloperProfileController: GetDeveloperProfileController,
    @inject("IAuthService") authService: IAuthService,
    @inject("Container") container: Container,
  ) {
    this.app = Fastify({
      logger: {
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      },
    })
    
    this.registerDeveloperController = registerDeveloperController
    this.registerCompanyController = registerCompanyController
    this.loginDeveloperController = loginDeveloperController
    this.loginCompanyController = loginCompanyController
    this.loginAdminController = loginAdminController
    this.loginHRController = loginHRController
    this.loginInterviewerController = loginInterviewerController
    this.verifyOTPController = verifyOTPController
    this.resendOTPController = resendOTPController
    this.requestPasswordResetController = requestPasswordResetController
    this.confirmPasswordResetController = confirmPasswordResetController
    this.logoutController = logoutController
    this.refreshTokenController = refreshTokenController
    this.getPasswordPolicyController = getPasswordPolicyController
    this.googleAuthController = googleAuthController

    this.listDevelopersController = listDevelopersController
    this.listCompaniesController = listCompaniesController
    this.blockDeveloperController = blockDeveloperController
    this.unblockDeveloperController = unblockDeveloperController
    this.deleteDeveloperController = deleteDeveloperController
    this.addDeveloperWarningController = addDeveloperWarningController
    this.approveCompanyController = approveCompanyController
    this.declineCompanyController = declineCompanyController
    this.blockCompanyController = blockCompanyController
    this.unblockCompanyController = unblockCompanyController

    this.createHRController = createHRController
    this.editHRController = editHRController
    this.deleteHRController = deleteHRController
    this.blockHRController = blockHRController
    this.listHRController = listHRController
    this.createInterviewerController = createInterviewerController
    this.updateCompanyPaymentController = updateCompanyPaymentController
    this.submitAdditionalInfoController = submitAdditionalInfoController
    

    this.createDeveloperProfileController = createDeveloperProfileController
    this.getDeveloperProfileController = getDeveloperProfileController
    this.authPreHandlers = createAuthPreHandlersFromAuthService(
      authService,
      container.get("ICompanyRepository"),
      container.get("IDeveloperRepository"),
      container.get("IHRRepository"),
      container.get("IInterviewerRepository"),
      container.get("IBlockHistoryRepository")
    )
    this.setupMiddleware()
    this.setupRoutes()
    this.setupErrorHandler()
  }

  private async setupMiddleware(): Promise<void> {
    await this.app.register(cors, {
      origin: true,
      credentials: true,
    })
    await this.app.register(helmet)
    await this.app.register(cookie)
    await this.app.register(multipart, {
      limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10
      }
    })
  }

  private setupRoutes(): void {
    const { requireRole } = this.authPreHandlers
    const onlyAdmin = { preHandler: requireRole("admin") }
    const onlyCompany = { preHandler: requireRole("company") }
    const onlyDeveloper = { preHandler: requireRole("developer") }
    
    this.app.get("/health", async (request, reply) => {
      return { status: "ok", timestamp: new Date().toISOString() }
    })
    
    this.app.post("/auth/register/developer", this.registerDeveloperController.execute.bind(this.registerDeveloperController))
    this.app.post("/auth/register/company", this.registerCompanyController.execute.bind(this.registerCompanyController))
    this.app.post("/auth/verify-otp", this.verifyOTPController.execute.bind(this.verifyOTPController))
    this.app.post("/auth/resend-otp", this.resendOTPController.execute.bind(this.resendOTPController))
    this.app.post("/auth/password-reset/request", this.requestPasswordResetController.execute.bind(this.requestPasswordResetController))
    this.app.post("/auth/password-reset/confirm", this.confirmPasswordResetController.execute.bind(this.confirmPasswordResetController))
    this.app.post("/auth/login/developer", this.loginDeveloperController.execute.bind(this.loginDeveloperController))
    this.app.post("/auth/login/company", this.loginCompanyController.execute.bind(this.loginCompanyController))
    this.app.post("/auth/login/hr", this.loginHRController.execute.bind(this.loginHRController))
    this.app.post("/auth/login/interviewer", this.loginInterviewerController.execute.bind(this.loginInterviewerController))
    this.app.post("/auth/login/admin", this.loginAdminController.execute.bind(this.loginAdminController))
    this.app.post("/auth/google", this.googleAuthController.execute.bind(this.googleAuthController))

    this.app.post("/auth/logout", this.logoutController.execute.bind(this.logoutController))
    this.app.post("/auth/refresh", this.refreshTokenController.execute.bind(this.refreshTokenController))
    this.app.get("/auth/password-policy", this.getPasswordPolicyController.execute.bind(this.getPasswordPolicyController))

    this.app.post(
      "/developer/profile/create",
      onlyDeveloper,
      this.createDeveloperProfileController.execute.bind(this.createDeveloperProfileController),
    )
    this.app.get(
      "/developer/profile",
      onlyDeveloper,
      this.getDeveloperProfileController.execute.bind(this.getDeveloperProfileController),
    )
    this.app.get("/admin/developers/list", onlyAdmin, this.listDevelopersController.execute.bind(this.listDevelopersController))
    this.app.get("/admin/companies/list", onlyAdmin, this.listCompaniesController.execute.bind(this.listCompaniesController))
    this.app.post("/admin/developers/block", onlyAdmin, this.blockDeveloperController.execute.bind(this.blockDeveloperController))
    this.app.post("/admin/developers/unblock", onlyAdmin, this.unblockDeveloperController.execute.bind(this.unblockDeveloperController))
    this.app.delete("/admin/developers/delete", onlyAdmin, this.deleteDeveloperController.execute.bind(this.deleteDeveloperController))
    this.app.post("/admin/developers/warn", onlyAdmin, this.addDeveloperWarningController.execute.bind(this.addDeveloperWarningController))
    this.app.post("/admin/companies/approve", onlyAdmin, this.approveCompanyController.execute.bind(this.approveCompanyController))
    this.app.post("/admin/companies/decline", onlyAdmin, this.declineCompanyController.execute.bind(this.declineCompanyController))
    this.app.post("/admin/companies/block", onlyAdmin, this.blockCompanyController.execute.bind(this.blockCompanyController))
    this.app.post("/admin/companies/unblock", onlyAdmin, this.unblockCompanyController.execute.bind(this.unblockCompanyController))

    this.app.post("/company/hr/create", onlyCompany, this.createHRController.execute.bind(this.createHRController))
    this.app.put("/company/hr/edit", onlyCompany, this.editHRController.execute.bind(this.editHRController))
    this.app.delete("/company/hr/delete", onlyCompany, this.deleteHRController.execute.bind(this.deleteHRController))
    this.app.post("/company/hr/block", onlyCompany, this.blockHRController.execute.bind(this.blockHRController))
    this.app.get("/company/hr/list", onlyCompany, this.listHRController.execute.bind(this.listHRController))
    this.app.post("/company/interviewers/create", onlyCompany, this.createInterviewerController.execute.bind(this.createInterviewerController))
    this.app.post("/company/payment", onlyCompany, this.updateCompanyPaymentController.execute.bind(this.updateCompanyPaymentController))
    this.app.post("/company/submit-additional-info", onlyCompany, this.submitAdditionalInfoController.execute.bind(this.submitAdditionalInfoController))
  }

  private setupErrorHandler(): void {
    this.app.setErrorHandler((error, request, reply) => {
      request.log.error({ err: error, url: request.url, reqId: request.id }, "Unhandled error")

      if (error instanceof ZodError) {
        const details = error.issues.map(issue => ({
          path: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        }))
        reply.code(400).send({
          error: "VALIDATION_ERROR",
          message: "Invalid request payload",
          details,
          statusCode: 400,
        })
        return
      }

      if (error instanceof DomainError) {
        reply.code(error.statusCode).send({
          error: error.code,
          message: error.message,
          statusCode: error.statusCode,
        })
        return
      }

      const statusCode = (error as any).statusCode || 500
      const isDev = process.env.NODE_ENV !== "production"
      const response: any = {
        error: error.name || "InternalServerError",
        message: isDev ? error.message : "Internal Server Error",
        statusCode,
      }
      if (isDev && error.stack) {
        response.stack = String(error.stack).split("\n")
      }
      reply.code(statusCode).send(response)
      return
    })
  }

  async start(): Promise<void> {
    const port = Number.parseInt(process.env.PORT || "3000")
    await this.app.listen({ port, host: "0.0.0.0" })
    console.log(`Server running on port ${port}`)
  }
}
