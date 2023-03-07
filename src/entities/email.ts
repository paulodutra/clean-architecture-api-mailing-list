import { Either, right, left } from '../shared/either'
import { InvalidEmailError } from './errors/invalid-email-error'

export class Email {
    
    public readonly value: string

    private constructor (value: string) {
        this.value = value
    }
    static create (email: string): Either<InvalidEmailError, Email> {
        if (Email.validate(email)) {
           return right(new Email(email)) 
        }

        return left(new InvalidEmailError())
    }
    static validate(email: string): boolean {
        if (!email) {
            return false
        }

        if (email.length > 320) {
            return false
        }

        const emailRegex = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
        if(!emailRegex.test(email)) {
            return false
        }
        
        const [localPart, domain] = email.split('@')
        if (localPart.length === 0 || localPart.length > 64) {
            return false
        }

        if (domain.length === 0 || domain.length > 255) {
            return false
        }

        const domainParts = domain.split('.')
        if (domainParts.some(function (part) {
            return part.length > 63
        })) {
            return false
        }
        return true
    }
}
