import { UserData } from '@/entities'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'
import { Either, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { SendEmail } from '@/usecases/send-email'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'

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

class MailServiceMock implements EmailService {
    public timesSendWasCalled = 0
    async send(emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
        this.timesSendWasCalled++
        return right(emailOptions) 
    }
}

describe('Register and send email to user', () => {
    test('should add user with complete data to mailing list', async () => {
        const users: UserData[] = []
        const repo: UserRepository = new InMemoryUserRepository(users)
        const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const name = 'user name'
        const email = 'user@email.com'
        const mailServiceMock = new MailServiceMock()
        const sendEmailUseCase = new SendEmail(mailOptions, mailServiceMock) 
        const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
        const response = await registerAndSendEmailUseCase.perform({ name, email })
        const user = repo.findUserByEmail(`${email}`)
        expect((await user).name).toBe('user name')
        expect(response.value.name).toBe(name)
        expect(mailServiceMock.timesSendWasCalled).toEqual(1)
        expect(response.value.name).toEqual('user name')
    })
})