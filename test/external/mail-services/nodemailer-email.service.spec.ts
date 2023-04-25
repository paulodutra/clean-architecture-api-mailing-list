import { NodemailerEmailService } from '@/external/mail-services'
import { MailServiceError } from '@/usecases/errors'
import { EmailOptions } from '@/usecases/send-email/ports'

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

jest.mock('nodemailer')
const nodemailer = require('nodemailer')
const sendMailStub = jest.fn().mockReturnValueOnce('ok')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailStub })

describe('Nodemailer mail service adapter', () => {
    
    beforeEach(() => {
      sendMailStub.mockClear()
      nodemailer.createTransport.mockClear()  
    })

    test('should return ok if emai is sent', async () => {
        const nodemailer = new NodemailerEmailService()
        const result = await nodemailer.send(mailOptions)
        expect(result.value).toEqual(mailOptions)
    })

    test('should return error if email is not sent', async () => {
        const nodemailer = new NodemailerEmailService()
        sendMailStub.mockImplementationOnce(() => {
            throw new Error()
        })
        const result = await nodemailer.send(mailOptions)
        expect(result.value).toBeInstanceOf(MailServiceError)
    })
})
