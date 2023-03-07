export class Email {
    static validate(email: string): boolean {
       if (!email) {
        return false
       }
       if (email.length > 320) {
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
