import Email from 'email-templates'
import config from 'config'
import base64Img from 'base64-img'

class EmailHandler {
    constructor(template, user, data, callback, error) {
        Object.assign(this, {
            template: template,
            receiver: user.email,
            data: data,
            user: user,
            callback: callback,
            emailConfig: {
                message: {
                    from: config.email
                },
                transport: {
                    host: process.env.EMAIL_SMTP,
                    port: process.env.EMAIL_PORT,
                    auth: {
                        user: process.env.EMAIL_USERNAME,
                        pass: process.env.EMAIL_PASSWORD
                    }
                },
                send: (process.env.NODE_ENV != 'test'),
                views: {
                    options: {
                        extension: 'mustache'
                    },
                    root: __dirname
                }
            }
        })
    }

    sendEmailResetLink() {
        const callback = this.callback
        const error = this.error
        const email = new Email(this.emailConfig)
        const firstName = this.user.firstName
        const lastName = this.user.lastName
        const resetLink = this.data.resetLink
        email.send({
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    images: false
                }
            },
            template: 'templates/resetPassword',
            message: {
                from: process.env.EMAIL_FROM || config.emailFrom,
                to: this.user.email,
                /*attachments: [
                  {
                    filename: 'logo.png',
                    path: __dirname + '/assets/logo.png',
                    cid: 'logo'
                  }
                ]*/
            },
            locals: {
                firstName: firstName,
                lastName: lastName,
                resetLink: config.publicUrl + `/${resetLink}`
            }
        })
            .then(callback)
            .catch(error)
    }
    sendNewUserGreet() {
        const callback = this.callback
        const error = this.error
        const email = new Email(this.emailConfig)
        const firstName = this.user.firstName
        const lastName = this.user.lastName
        const verificationLink = this.data.verificationLink
        email.send({
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    images: false
                }
            },
            template: 'templates/newUser',
            message: {
                from: process.env.EMAIL_FROM || config.emailFrom,
                to: this.user.email,
                /*attachments: [
                  {
                    filename: 'logo.png',
                    path: __dirname + '/assets/logo.png',
                    cid: 'logo'
                  }
                ]*/
            },
            locals: {
                firstName: firstName,
                lastName: lastName,
                verificationLink: config.publicUrl + `/${verificationLink}`
            }
        })
            .then(callback)
            .catch(error)
    }
}
export default EmailHandler