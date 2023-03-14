import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { MissingParamError } from '@/web-controllers/errors/missing-param-error'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { RegisterUserController } from '@/web-controllers/register-user-controller'
import { InMemoryUserRepository } from '@test/usecases/register-user-on-mailing-list/repository'

describe('Register user web controller', () => {
    test('should return status code 201 when request contains valid user data', async () => {
        const request: HttpRequest = {
            body: {
                name: 'Any',
                email: 'any@email.com'
            }
        }
        const users: UserData[] = []
        const repo: UserRepository = new InMemoryUserRepository(users)
        const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const controller: RegisterUserController = new RegisterUserController(useCase)
        const response: HttpResponse = await controller.handle(request)
        expect(response.statusCode).toEqual(201)
        expect(response.body).toEqual(request.body)
    })

    test('should return status code 400 when request contains invalid name user', async () => {
        const request: HttpRequest = {
            body: {
                name: 'A',
                email: 'any@email.com'
            }
        }
        const users: UserData[] = []
        const repo: UserRepository = new InMemoryUserRepository(users)
        const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const controller: RegisterUserController = new RegisterUserController(useCase)
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
        const users: UserData[] = []
        const repo: UserRepository = new InMemoryUserRepository(users)
        const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const controller: RegisterUserController = new RegisterUserController(useCase)
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
        const users: UserData[] = []
        const repo: UserRepository = new InMemoryUserRepository(users)
        const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const controller: RegisterUserController = new RegisterUserController(useCase)
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
        const users: UserData[] = []
        const repo: UserRepository = new InMemoryUserRepository(users)
        const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const controller: RegisterUserController = new RegisterUserController(useCase)
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
        const users: UserData[] = []
        const repo: UserRepository = new InMemoryUserRepository(users)
        const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const controller: RegisterUserController = new RegisterUserController(useCase)
        const response: HttpResponse = await controller.handle(request)
        expect(response.statusCode).toEqual(400)
        expect(response.body).toBeInstanceOf(MissingParamError)
        expect((response.body  as Error).message).toEqual('Missing parameter from request: name email.')
    })
})
