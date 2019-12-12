import { expect } from 'chai'
import config from 'config'
import Database from '../../db'
import Profile from './profileModel'
import Reset from './resetModel'
import Login from './loginModel'
import { logIn, createProfile, getProfile, getAllProfiles, deleteProfile, updateProfile, confirmProfile, createPasswordReset, confirmPasswordReset } from '../../actions/profileOperations'

var runIntegrationTests = (process.env.INTEGRATION_TESTS == 'true')

if (runIntegrationTests) {
  new Database().connect()
}

describe('Database models', (done) => {
  /* Done before every test execution */
  beforeEach(async () => {
    await Profile.deleteMany({})
    await Reset.deleteMany({})
    await Login.deleteMany({})
  })

  /* Done after all tests are executed */
  after(async () => {
    await Profile.deleteMany({})
    await Reset.deleteMany({})
    await Login.deleteMany({})
  })

  describe('Profile', () => {
    if (runIntegrationTests) {
      it('Should fail with invalid profile', (done) => {
        var invalid = new Profile()
        invalid.validate((err) => {
          expect(err.errors['address.city']).to.exist
          expect(err.errors.birthDate).to.exist
          expect(err.errors.firstName).to.exist
          expect(err.errors.lastName).to.exist
          done()
        })
      })

      it('Should login succesfully', (done) => {
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

          logIn(valid.nickname, valid.password).then((loginResult) => {
            expect(loginResult.token).to.exist
            done()
          })
        })
      })

      it('Should create password reset token and use it', (done) => {
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

        createProfile({ user: JSON.parse(JSON.stringify(valid)) }).then(async (profile) => {
          expect(profile.password).to.not.eq(valid.password)

          let createResult = await createPasswordReset(valid.nickname)

          expect(createResult).to.eq(true)
          await Login.findOne({ normalizedNickName: valid.nickname.toUpperCase() }).populate('passwordReset').then(async (login) => {
            expect(login.passwordReset).to.exist

            let confirmResult = await confirmPasswordReset(login.nickname, login.passwordReset.verificationToken, 'newpassword')
            expect(confirmResult).to.eq(true)
            Login.findOne({ normalizedNickName: valid.nickname.toUpperCase() }).then(async (login) => {
              expect(login.passwordReset).to.not.exist
            })
          })

          done()
        })
      })
    }
  })
})