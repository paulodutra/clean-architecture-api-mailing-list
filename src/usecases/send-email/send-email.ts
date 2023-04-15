import { UseCase } from '@/usecases/ports'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'
import { User, UserData } from '@/entities'
import { Either, left } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'

export class SendEmail implements UseCase {

    private readonly emailOptions: EmailOptions
    private readonly emailService: EmailService

    constructor (emailOptions: EmailOptions, emailService: EmailService) {
        this.emailOptions = emailOptions
        this.emailService = emailService
    }

    async perform(userData: UserData): 
    Promise<Either<InvalidNameError | InvalidEmailError | MailServiceError, EmailOptions>> {
        const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(userData)
        if (userOrError.isLeft()) {
            return left(userOrError.value)
        }
        const user = userOrError.value
        const greetings = 'E ai <br>' + user.name + '</b>, tudo bem ?'
        const customizedHtml = greetings + '<br><br>' + this.emailOptions.html
        const emailInfo: EmailOptions = {
            ...this.emailOptions,
            to: user.name + '<' + user.email + '>',
            html: customizedHtml
        }
        return this.emailService.send(emailInfo)
    }

}
