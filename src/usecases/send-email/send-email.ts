import { UseCase } from '@/usecases/ports'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'
import { UserData } from '@/entities'
import { Either } from '@/shared'
import { MailServiceError } from '@/usecases/errors'

export class SendEmail implements UseCase {

    private readonly emailOptions: EmailOptions
    private readonly emailService: EmailService

    constructor (emailOptions: EmailOptions, emailService: EmailService) {
        this.emailOptions = emailOptions
        this.emailService = emailService
    }

    async perform(userData: UserData): Promise<Either<MailServiceError, EmailOptions>> {
        const greetings = 'E ai <br>' + userData.name + '</b>, tudo bem ?'
        const customizedHtml = greetings + '<br><br>' + this.emailOptions.html
        const emailInfo: EmailOptions = {
            ...this.emailOptions,
            to: userData.name + '<' + userData.email + '>',
            html: customizedHtml
        }
        return this.emailService.send(emailInfo)
    }

}
