import RandomString from 'randomstring'
import crypto from 'crypto'
import Type from '../models/consumpionTypeModel'
import Admin from '../models/profileModel'
import AdminLogin from '../models/loginModel'
import Const from '../../constants'
import mongoose from 'mongoose'

exports.seed = () => {
    AdminLogin.findOne({ nickname: "admin" })
        .then((result) => {
            if (!result) {
                let loginId = mongoose.Types.ObjectId()

                let salt = RandomString.generate()
                let password = crypto.createHmac('sha256', process.env.PROFILE_HASH_SECRET || config.profileHashSecret)
                    .update(process.env.ADMIN_PASSWORD + salt || config.adminPassword + salt)
                    .digest('hex')

                let profile = new Admin({
                    firstName: 'Fixu',
                    lastName: 'Admin',
                    birthDate: new Date(),
                    address: {
                        city: 'Pori'
                    },
                    roles: [ Const.ROLE_ADMIN ],
                    loginId: loginId,
                })
            
                Admin.create(profile).then((profileResult) => {
                    if (!profileResult) {
                        throw new ApolloError("Couldn't create profile")
                    }

                    let login = new AdminLogin({
                        _id: loginId,
                        normalizedNickName: 'ADMIN',
                        nickname: 'admin',
                        password: password,
                        salt: salt,
                        userConfirmed: true,
                        email: 'admin@fixu.com',
                        profileId: profileResult._id
                    })
                    AdminLogin.create(login).then((loginResult) => {

                    })
                })
            }
        })

    Type.findOne({ title: "Henkilökohtainen hygienia: Suihku" })
        .then((result) => {
            if (!result) {
                Type.create({
                    title: "Henkilökohtainen hygienia: Suihku",
                    description: "Kävin suihkussa nopeammin kuin yleensä",
                    amount: 0.5,
                    amountType: "Minuuttia"
                })
            }
        })

    Type.findOne({ title: "Henkilökohtainen hygienia: Sauna" })
        .then((result) => {
            if (!result) {
                Type.create({
                    title: "Henkilökohtainen hygienia: Sauna",
                    description: "Sauna oli päällä vähemmän aikaa kuin yleensä",
                    amount: 0.1,
                    amountType: "Minuuttia"
                })
            }
        })

    Type.findOne({ title: "Valaistus: Hehkulamppu" })
        .then((result) => {
            if (!result) {
                Type.create({
                    title: "Valaistus: Hehkulamppu",
                    description: "Pidin yksittäistä hehkulamppua vähemmän päällä kuin yleensä",
                    amount: 0.06,
                    amountType: "Tuntia"
                })
            }
        })

    Type.findOne({ title: "Valaistus: Loisteputki" })
        .then((result) => {
            if (!result) {
                Type.create({
                    title: "Valaistus: Loisteputki",
                    description: "Pidin yksittäistä loisteputkea vähemmän päällä kuin yleensä",
                    amount: 0.06,
                    amountType: "Tuntia"
                })
            }
        })

    Type.findOne({ title: "Siisteys: Tiskaus" })
        .then((result) => {
            if (!result) {
                Type.create({
                    title: "Siisteys: Tiskaus",
                    description: "Tiskasin käsin konetiskausen sijaan",
                    amount: 1,
                    amountType: "Kertaa"
                })
            }
        })

    Type.findOne({ title: "Siisteys: Pyykinpesu" })
        .then((result) => {
            if (!result) {
                Type.create({
                    title: "Siisteys: Pyykinpesu",
                    description: "Pesin käsin konepesun sijaan",
                    amount: 1.8,
                    amountType: "Kertaa"
                })
            }
        })


    Type.findOne({ title: "Siisteys: Pyykin kuivattaminen" })
        .then((result) => {
            if (!result) {
                Type.create({
                    title: "Siisteys: Pyykin kuivattaminen",
                    description: "Kuivatin vaatteet ilman kuivausrumpua",
                    amount: 2.1,
                    amountType: "Kertaa"
                })
            }
        })

    Type.findOne({ title: "Viihde: Television katselu" })
        .then((result) => {
            if (!result) {
                Type.create({
                    title: "Viihde: Television katselu",
                    description: "Katsoin televisiota vähemmän kuin yleensä",
                    amount: 0.0036,
                    amountType: "Minuuttia"
                })
            }
        })

    Type.findOne({ title: "Viihde: Radion kuuntelu" })
        .then((result) => {
            if (!result) {
                Type.create({
                    title: "Viihde: Radion kuuntelu",
                    description: "Kuuntelin radiota vähemmän kuin yleensä",
                    amount: 0.00017,
                    amountType: "Minuuttia"
                })
            }
        })

    Type.findOne({ title: "Viihde: Kannettavan tietokoneen käyttö" })
        .then((result) => {
            if (!result) {
                Type.create({
                    title: "Viihde: Kannettavan tietokoneen käyttö",
                    description: "Käytin kannettavaa tietokonetta vähemmän kuin yleensä",
                    amount: 0.005,
                    amountType: "Minuuttia"
                })
            }
        })

    Type.findOne({ title: "Viihde: Pöytätietokoneen käyttö" })
        .then((result) => {
            if (!result) {
                Type.create({
                    title: "Viihde: Pöytätietokoneen käyttö",
                    description: "Käytin pöytätietokonetta vähemmän kuin yleensä",
                    amount: 0.0085,
                    amountType: "Minuuttia"
                })
            }
        })

    Type.findOne({ title: "Ruuanlaitto: Kahvi" })
        .then((result) => {
            if (!result) {
                Type.create({
                    title: "Ruuanlaitto: Kahvi",
                    description: "Jätin kahvin keittämättä",
                    amount: 0.1,
                    amountType: "kertaa"
                })
            }
        })

    Type.findOne({ title: "Ruuanlaitto: Tee" })
        .then((result) => {
            if (!result) {
                Type.create({
                    title: "Ruuanlaitto: Tee",
                    description: "Jätin teen keittämättä",
                    amount: 0.1,
                    amountType: "kertaa"
                })
            }
        })

    Type.findOne({ title: "Ruuanlaitto: Liesi tai uuni" })
        .then((result) => {
            if (!result) {
                Type.create({
                    title: "Ruuanlaitto: Liesi tai uuni",
                    description: "Valmistin ruuan ilman uunia tai liettä",
                    amount: 1.5,
                    amountType: "kertaa"
                })
            }
        })
}