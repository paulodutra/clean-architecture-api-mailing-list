import { UseCase } from '@/usecases/ports'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'
import { User } from '@/entities'
import { Either } from '@/shared'
import { MailServiceError } from '@/usecases/errors'

export class SendEmail implements UseCase {

    private readonly emailOptions: EmailOptions
    private readonly emailService: EmailService

    constructor (emailOptions: EmailOptions, emailService: EmailService) {
        this.emailOptions = emailOptions
        this.emailService = emailService
    }

    async perform(user: User): 
    Promise<Either<MailServiceError, EmailOptions>> {
        const greetings = 'E ai <br>' + user.name.value + '</b>, tudo bem ?'
        const customizedHtml = greetings + '<br><br>' + this.emailOptions.html
        const emailInfo: EmailOptions = {
            ...this.emailOptions,
            to: user.name.value + '<' + user.email.value + '>',
            html: customizedHtml
        }
        return this.emailService.send(emailInfo)
    }

}
