import rabbit from 'amqplib'
import config from 'config'
import EmailHandler from './email/emailHandler'

class Rabbit {
    constructor() {
        this.queue = 'api_queue'
        this.emailQueue = 'email_queue'
        this.connection = null
    }

    emailConsumer() {
        var queue = this.emailQueue
        rabbit.connect(config.rabbitHost).then(function (conn) {
            conn.createChannel().then(function (ch) {
                ch.assertQueue(queue, { durable: false })
                console.log(' [*] Waiting for email messages in %s.', queue)
                ch.consume(queue, function (msg) {
                    const body = JSON.parse(msg.content.toString())
                    const handler = new EmailHandler(body.template, {
                        firstName: body.user.firstName,
                        lastName: body.user.lastName,
                        email: body.user.email
                    }, {
                        resetLink: body.data.resetLink,
                        verificationLink: body.data.verificationLink
                    }, () => { console.log('mail sent') }, (error) => { console.log(error) })

                    switch (body.template) {
                        case 'resetPassword':
                            handler.sendEmailResetLink()
                            break
                        case 'newUser':
                            handler.sendNewUserGreet()
                            break
                    }
                }, { noAck: true })
            })
        })
    }

    async createEmail(emailInfo) {
        var queue = this.emailQueue
        const conn = await rabbit.connect(config.rabbitHost)
        const ch = await conn.createChannel()
        ch.assertQueue(queue, { durable: false })
        ch.sendToQueue(queue, Buffer.from(JSON.stringify(emailInfo)))
    }
}
export default Rabbit