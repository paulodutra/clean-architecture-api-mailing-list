export class Email {
    static validate(email: string): boolean {
       if (!email) {
        return false
       }
       if (email.length > 320) {
           return false
       }
       const [localPart] = email.split('@')
       if (localPart.length > 64) {
        return false                                               
       }
       return true
    }
}
