import { Email } from '@/entities'

describe ('email validation - value object', () => {
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

    test('should not accept domain with a part larger than 64 chars', () => {
        const email: string = 'any@' + 'd'.repeat(64) + '.com'
        const validation: boolean = Email.validate(email)
        expect(validation).toBeFalsy()
    })

    test('should not accept local part with invalid char', () => {
        const email: string = 'any mail@mail.com'
        const validation: boolean = Email.validate(email)
        expect(validation).toBeFalsy()
    })

    test('should not accept local part with two dots', () => {
        const email: string = 'any..mail@mail.com'
        const validation: boolean = Email.validate(email)
        expect(validation).toBeFalsy()
    })

    test('should not accept local part with ending dot', () => {
        const email: string = 'any.mail@mail.com.'
        const validation: boolean = Email.validate(email)
        expect(validation).toBeFalsy()
    })

    test('should not accept local part without an at-sign', () => {
        const email: string = 'any.mailmail.com'
        const validation: boolean = Email.validate(email)
        expect(validation).toBeFalsy()
    })
})
