import Email from 'email-templates'
import config from 'config'
import base64Img from 'base64-img'
import container from '#translate'
import Const from '#constants'
const localeService = container.resolve('localeService')

class EmailHandler {
    constructor(template, user, data, family, group, callback, error) {
        Object.assign(this, {
            template: template,
            receiver: user.email,
            data: data,
            user: user,
            family: family,
            group: group,
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
                attachments: [
                    {
                        filename: `${Const.HERO_FILENAME}`,
                        path: __dirname + `/assets/${Const.HERO_FILENAME}`,
                        cid: 'herologo'
                    }
                ]
            },
            locals: {
                email_subject: localeService.translate('EMAIL_PASSWORD_RESET_SUBJECT'),
                email_title: localeService.translate('EMAIL_PASSWORD_RESET_TITLE', { firstName: firstName }),
                email_content: localeService.translate('EMAIL_PASSWORD_RESET_CONTENT'),
                preheader_text: localeService.translate('EMAIL_PASSWORD_RESET_CONTENT'),
                button_text: localeService.translate('EMAIL_PASSWORD_RESET_BUTTON_TEXT'),
                service_description: localeService.translate('EMAIL_SERVICE_DESCRIPTION'),
                resetLink: (process.env.FRONTEND_URL ?? config.publicUrl) + `/${resetLink}`
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
                attachments: [
                    {
                        filename: `${Const.HERO_FILENAME}`,
                        path: __dirname + `/assets/${Const.HERO_FILENAME}`,
                        cid: 'herologo'
                    }
                ]
            },
            locals: {
                email_subject: localeService.translate('EMAIL_NEW_MEMBER_SUBJECT'),
                email_title: localeService.translate('EMAIL_NEW_MEMBER_TITLE', { firstName: firstName }),
                email_content: localeService.translate('EMAIL_NEW_MEMBER_CONTENT'),
                preheader_text: localeService.translate('EMAIL_NEW_MEMBER_CONTENT'),
                button_text: localeService.translate('EMAIL_NEW_MEMBER_BUTTON_TEXT'),
                service_description: localeService.translate('EMAIL_SERVICE_DESCRIPTION'),
                verificationLink: (process.env.FRONTEND_URL ?? config.publicUrl) + `/${verificationLink}`
            }
        })
            .then(callback)
            .catch(error)
    }

    sendFamilyMemberRequest() {
        const callback = this.callback
        const error = this.error
        const email = new Email(this.emailConfig)
        const firstName = this.user.firstName
        const lastName = this.user.lastName
        const familyName = this.family.name
        email.send({
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    images: false
                }
            },
            template: 'templates/newFamilyMember',
            message: {
                from: process.env.EMAIL_FROM || config.emailFrom,
                to: this.user.email,
                attachments: [
                    {
                        filename: `${Const.HERO_FILENAME}`,
                        path: __dirname + `/assets/${Const.HERO_FILENAME}`,
                        cid: 'herologo'
                    }
                ]
            },
            locals: {
                email_subject: localeService.translate('EMAIL_NEW_FAMILYMEMBER_SUBJECT', { familyName: familyName }),
                email_title: localeService.translate('EMAIL_NEW_FAMILYMEMBER_TITLE', { firstName: firstName }),
                email_content: localeService.translate('EMAIL_NEW_FAMILYMEMBER_CONTENT', { familyName: familyName }),
                preheader_text: localeService.translate('EMAIL_NEW_FAMILYMEMBER_CONTENT', { familyName: familyName }),
                button_text: localeService.translate('EMAIL_NEW_FAMILYMEMBER_BUTTON_TEXT'),
                service_description: localeService.translate('EMAIL_SERVICE_DESCRIPTION'),
                confirmLink: (process.env.FRONTEND_URL ?? config.publicUrl) + `/account/family`
            }
        })
            .then(callback)
            .catch(error)
    }

    sendGroupMemberInviteRequest() {
        const callback = this.callback
        const error = this.error
        const email = new Email(this.emailConfig)
        const firstName = this.user.firstName
        const lastName = this.user.lastName
        const groupName = this.group.name
        email.send({
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    images: false
                }
            },
            template: 'templates/newGroupMemberInvite',
            message: {
                from: process.env.EMAIL_FROM || config.emailFrom,
                to: this.user.email,
                attachments: [
                    {
                        filename: `${Const.HERO_FILENAME}`,
                        path: __dirname + `/assets/${Const.HERO_FILENAME}`,
                        cid: 'herologo'
                    }
                ]
            },
            locals: {
                email_subject: localeService.translate('EMAIL_NEW_GROUPMEMBERINVITE_SUBJECT', { groupName: groupName }),
                email_title: localeService.translate('EMAIL_NEW_GROUPMEMBERINVITE_TITLE', { firstName: firstName }),
                email_content: localeService.translate('EMAIL_NEW_GROUPMEMBERINVITE_CONTENT', { groupName: groupName }),
                preheader_text: localeService.translate('EMAIL_NEW_GROUPMEMBERINVITE_CONTENT', { groupName: groupName }),
                button_text: localeService.translate('EMAIL_NEW_GROUPMEMBERINVITE_BUTTON_TEXT'),
                service_description: localeService.translate('EMAIL_SERVICE_DESCRIPTION'),
                confirmLink: (process.env.FRONTEND_URL ?? config.publicUrl) + `/account/groups`
            }
        })
            .then(callback)
            .catch(error)
    }

    sendFriendRequest() {
        const callback = this.callback
        const error = this.error
        const email = new Email(this.emailConfig)
        const firstName = this.user.firstName
        const lastName = this.user.lastName
        const familyName = this.family.name
        email.send({
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    images: false
                }
            },
            template: 'templates/newFriendRequest',
            message: {
                from: process.env.EMAIL_FROM || config.emailFrom,
                to: this.user.email,
                attachments: [
                    {
                        filename: `${Const.HERO_FILENAME}`,
                        path: __dirname + `/assets/${Const.HERO_FILENAME}`,
                        cid: 'herologo'
                    }
                ]
            },
            locals: {
                email_subject: localeService.translate('EMAIL_NEW_FRIENDREQUEST_SUBJECT', { familyName: familyName }),
                email_title: localeService.translate('EMAIL_NEW_FRIENDREQUEST_TITLE', { firstName: firstName }),
                email_content: localeService.translate('EMAIL_NEW_FRIENDREQUEST_CONTENT', { familyName: familyName }),
                preheader_text: localeService.translate('EMAIL_NEW_FRIENDREQUEST_CONTENT', { familyName: familyName }),
                button_text: localeService.translate('EMAIL_NEW_FRIENDREQUEST_BUTTON_TEXT'),
                service_description: localeService.translate('EMAIL_SERVICE_DESCRIPTION'),
                confirmLink: (process.env.FRONTEND_URL ?? config.publicUrl) + `/account/friends`
            }
        })
            .then(callback)
            .catch(error)
    }
}
export default EmailHandler