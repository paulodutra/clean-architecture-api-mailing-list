import { Email } from './email'

describe ('email validation', () => {
    test('should not accept null strings', () => {
        const email = null
        const validation: boolean = Email.validate(email)
        expect(validation).toBeFalsy()
    })

    test('should not accept empty strings', () => {
        const email: string = ''
        const validation: boolean = Email.validate(email)
        expect(validation).toBeFalsy()
    })

    test('should accept valid email', () => {
        const email: string = 'any@mail.com'
        const validation: boolean = Email.validate(email)
        expect(validation).toBeTruthy()
    })

    test('should not accept string larger than 320 chars', () => {
        const email: string = 'l'.repeat(64) + '@' + 'd'.repeat(128) + '.' + 'd'.repeat(127)
        const validation: boolean = Email.validate(email)
        expect(validation).toBeFalsy()
    })

    test('should not accept domain part larger than 255 chars', () => {
        const email: string = 'local@' + 'd'.repeat(128) + '.' + 'd'.repeat(127)
        const validation: boolean = Email.validate(email)
        expect(validation).toBeFalsy()
    })

    test('should not accept empty local part', () => {
        const email: string = '@mail.com'
        const validation: boolean = Email.validate(email)
        expect(validation).toBeFalsy()
    })

    test('should not accept local part larger than 64 chars', () => {
        const email: string = 'l'.repeat(65) + '@mail.com'
        const validation: boolean = Email.validate(email)
        expect(validation).toBeFalsy()
    })

    test('should not accept empty domain', () => {
        const email: string = 'any@'
        const validation: boolean = Email.validate(email)
        expect(validation).toBeFalsy()
    })
})
