import Rabbit from '../rabbit'

class Email {
    send(mailinfo) {
        return new Rabbit().createEmail(mailinfo)
    }
}
export default Email