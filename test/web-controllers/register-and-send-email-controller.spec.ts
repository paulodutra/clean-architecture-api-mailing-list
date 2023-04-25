import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { UseCase } from '@/usecases/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { MissingParamError } from '@/web-controllers/errors'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { RegisterAndSendEmailController } from '@/web-controllers/register-and-send-email-controller'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'
import { MailServiceError } from '@/usecases/errors'
import { Either, right } from '@/shared'
import { SendEmail } from '@/usecases/send-email'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'

class ErrorThrowingUseCaseStub implements UseCase {

    perform(request: any): Promise<void> {
        throw Error()
    }

}

const fromName = 'Teste'
const fromEmail = 'from_email@mail.com'
const toName = 'Any'
const toEmail = 'any@mail.com'
const subject = 'Teste email'
const emailBody = 'Test email'
const emailBodyHtml = '<b>Hello world attachment test</b>'
const attachmentFilePath = '../../resource/text.txt'
const attachment = [{
    filename: attachmentFilePath,
    contentType: 'text/plain'
}]

const mailOptions: EmailOptions = {
    host: 'test',
    port: 867,
    username: 'test',
    password: 'test',
    from: fromName + '' + fromEmail,
    to: toName + '<' + toEmail + '>',
    subject: subject,
    text: emailBody,
    html: emailBodyHtml,
    attachments: attachment
}

class MailServiceStub implements EmailService {
    async send(emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
       return right(emailOptions) 
    }
}

describe('Register user web controller', () => {

    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceStub = new MailServiceStub()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceStub)
    const registerAndSendEmailUseCase: RegisterAndSendEmail =
      new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
    const errorThrowingUseCaseStub: UseCase = new ErrorThrowingUseCaseStub()
    const controller: RegisterAndSendEmailController = new RegisterAndSendEmailController(registerAndSendEmailUseCase)

    test('should return status code 200 when request contains valid user data', async () => {
        const request: HttpRequest = {
            body: {
                name: 'Any',
                email: 'any@email.com'
            }
        }
        const response: HttpResponse = await controller.handle(request)
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual(request.body)
    })

    test('should return status code 400 when request contains invalid name user', async () => {
        const request: HttpRequest = {
            body: {
                name: 'A',
                email: 'any@email.com'
            }
        }
        const response: HttpResponse = await controller.handle(request)
        expect(response.statusCode).toEqual(400)
        expect(response.body).toBeInstanceOf(InvalidNameError)
    })

    test('should return status code 400 when request contains invalid email user', async () => {
        const request: HttpRequest = {
            body: {
                name: 'Any',
                email: 'anyemail.com'
            }
        }
        const response: HttpResponse = await controller.handle(request)
        expect(response.statusCode).toEqual(400)
        expect(response.body).toBeInstanceOf(InvalidEmailError)
    })

    test('should return status code 400 when request is missing user name', async () => {
        const request: HttpRequest = {
            body: {
                email: 'anyemail.com'
            }
        }
        const response: HttpResponse = await controller.handle(request)
        expect(response.statusCode).toEqual(400)
        expect(response.body).toBeInstanceOf(MissingParamError)
        expect((response.body  as Error).message).toEqual('Missing parameter from request: name.')
    })

    test('should return status code 400 when request is missing user email', async () => {
        const request: HttpRequest = {
            body: {
                name: 'Any'
            }
        }
        const response: HttpResponse = await controller.handle(request)
        expect(response.statusCode).toEqual(400)
        expect(response.body).toBeInstanceOf(MissingParamError)
        expect((response.body  as Error).message).toEqual('Missing parameter from request: email.')
    })

    test('should return status code 400 when request is missing user email', async () => {
        const request: HttpRequest = {
            body: {
            }
        }
        const response: HttpResponse = await controller.handle(request)
        expect(response.statusCode).toEqual(400)
        expect(response.body).toBeInstanceOf(MissingParamError)
        expect((response.body  as Error).message).toEqual('Missing parameter from request: name email.')
    })

    test('should return status code 500 when server raises', async () => {
        const request: HttpRequest = {
            body: {
                name: 'Any',
                email: 'any@email.com'
            }
        }
        const controller: RegisterAndSendEmailController = new RegisterAndSendEmailController(errorThrowingUseCaseStub)
        const response: HttpResponse = await controller.handle(request)
        expect(response.statusCode).toEqual(500)
        expect(response.body).toBeInstanceOf(Error)
    })
})
