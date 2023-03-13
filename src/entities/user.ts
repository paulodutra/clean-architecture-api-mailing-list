import { UserData } from './user-data'
import { Either, left, right } from '../shared/either'
import { InvalidNameError } from './errors/invalid-name-error'
import { InvalidEmailError } from './errors/invalid-email-error'
import { Name } from './name'
import { Email } from './email'

export class User {
    public readonly name: Name
    public readonly email: Email

    private constructor (name: Name, email: Email) {
        this.name = name
        this.email = email
    }
    static create (userData: UserData): Either<InvalidNameError | InvalidEmailError, User> {
        const nameOrError = Name.create(userData.name)
        if (nameOrError.isLeft()) {
            return left(nameOrError.value)
        }

        const emailOrError = Email.create(userData.email)

        if(emailOrError.isLeft()) {
           return left(emailOrError.value) 
        }
        const name: Name = nameOrError.value as Name
        const email: Email = emailOrError.value as Email
        return right(new User(name, email))
    }
}
