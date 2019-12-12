import { expect } from 'chai'
import config from 'config'
import Database from '../../db'
import Login from './loginModel'
import Profile from './profileModel'
import { logIn, createProfile, getProfile, getAllProfiles, deleteProfile, updateProfile, confirmProfile, createPasswordReset, confirmPasswordReset } from '../../actions/profileOperations'

var runIntegrationTests = (process.env.INTEGRATION_TESTS == 'true')

if (runIntegrationTests) {
  new Database().connect()
}

describe('Database models', (done) => {
  /* Done before every test execution */
  beforeEach(async () => {
    await Login.deleteMany({})
    await Profile.deleteMany({})
  })

  /* Done after all tests are executed */
  after(async () => {
    await Login.deleteMany({})
    await Profile.deleteMany({})
  })

  describe('Login', () => {
    if (runIntegrationTests) {
      it('Should faild with invalid model', (done) => {
        var invalid = new Login()
        invalid.validate((err) => {
          expect(err.errors.normalizedNickName).to.exist
          expect(err.errors.nickname).to.exist
          expect(err.errors.password).to.exist
          expect(err.errors.salt).to.exist
          expect(err.errors.email).to.exist
          done()
        })
      })

      it('Should retrieve login', (done) => {
        var valid = {
          firstName: 'test',
          lastName: 'person',
          nickname: 'Nikki',
          password: 'P@ssu123',
          email: 'foo1@bar.com',
          birthDate: "2019-10-28",
          address: {
            city: 'Pori'
          }
        }

        createProfile({ user: JSON.parse(JSON.stringify(valid)) }).then((profile) => {
          expect(profile.password).to.not.eq(valid.password)
          Login.findOne({ }).then((login) => {
            console.log(login)
            if (login) {
              done()
            }
          })
        })
      })

      // it('Should faild with invalid email 2', (done) => {
      //   var invalid = new Profile({
      //     firstName: 'test',
      //     lastName: 'person',
      //     normalizedNickName: 'NIKKI',
      //     nickname: 'Nikki',
      //     password: '12345',
      //     salt: '12345',
      //     email: 'foo@'
      //   })
      //   invalid.validate((err) => {
      //     expect(err.errors.email).to.exist
      //     done()
      //   })
      // })
    }
  })
})