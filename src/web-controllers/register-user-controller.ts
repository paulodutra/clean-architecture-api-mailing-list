import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { HttpRequest, HttpResponse } from './ports'
import { UserData } from '@/entities'
import { badRequest, created } from '@/web-controllers/util'

export class RegisterUserController {
    private readonly useCase: RegisterUserOnMailingList

    constructor (useCase: RegisterUserOnMailingList) {
        this.useCase = useCase
    }
    public async handle (request: HttpRequest): Promise<HttpResponse> {
        const userData: UserData = request.body
        const response = await this.useCase.registerUserOnMailingList(userData)
        if (response.isLeft()) {
           return badRequest(response.value) 
        }
        
        if (response.isRight()) {
            return created(response.value)
        }
    }
} 
