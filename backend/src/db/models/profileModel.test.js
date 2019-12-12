import { expect } from 'chai'
import config from 'config'
import Database from '../../db'
import Profile from './profileModel'
import Reset from './resetModel'
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
  })

  /* Done after all tests are executed */
  after(async () => {
    await Profile.deleteMany({})
    await Reset.deleteMany({})
  })

  describe('Profile', () => {
    if (runIntegrationTests) {
      it('Should fail with invalid profile', (done) => {
        var invalid = new Profile()
        invalid.validate((err) => {
          expect(err.errors.nickname).to.exist
          expect(err.errors.firstName).to.exist
          expect(err.errors.lastName).to.exist
          expect(err.errors.password).to.exist
          expect(err.errors.email).to.exist
          done()
        })
      })

      it('Should faild with invalid model', (done) => {
        var valid = new Profile({
          firstName: 'test',
          lastName: 'person',
          nickname: 'Nikki',
          password: '12345',
          salt: '12345',
          email: 'foo1@bar.com'
        })
        valid.save(function (err, item) {
          expect(err).to.not.exist
          var invalid = new Profile({
            firstName: 'test',
            lastName: 'person',
            nickname: 'Nikki',
            password: '12345',
            email: 'foo1@bar.com'
          })
          invalid.validate((err) => {
            expect(err.errors.nickname).to.exist
            expect(err.errors.email).to.exist
            expect(err.errors.salt).to.exist
            done()
          })
        })
      })

      it('Should faild with invalid email', (done) => {
        var invalid = new Profile({
          firstName: 'test',
          lastName: 'person',
          nickname: 'Nikki',
          password: '12345',
          salt: '12345',
          email: 'foobar.com'
        })
        invalid.validate((err) => {
          expect(err.errors.email).to.exist
          done()
        })
      })

      it('Should faild with invalid email 2', (done) => {
        var invalid = new Profile({
          firstName: 'test',
          lastName: 'person',
          nickname: 'Nikki',
          password: '12345',
          salt: '12345',
          email: 'foo@'
        })
        invalid.validate((err) => {
          expect(err.errors.email).to.exist
          done()
        })
      })

      it('Should login succesfully', (done) => {
        var valid = new Profile({
          firstName: 'test',
          lastName: 'person',
          nickname: 'Nikki',
          password: '12345',
          salt: '12345',
          email: 'foo1@bar.com'
        })

        createProfile({ user: JSON.parse(JSON.stringify(valid)) }).then((profile) => {
          expect(profile.password).to.not.eq(valid.password)

          logIn(valid.nickname, valid.password).then((loginResult) => {
            expect(loginResult.token).to.exist
            done()
          })
        })
      })

      it('Should create password reset token and use it', (done) => {
        var valid = new Profile({
          firstName: 'test',
          lastName: 'person',
          nickname: 'Nikki',
          password: '12345',
          salt: '12345',
          email: 'foo1@bar.com'
        })
        valid.save(async function (err, item) {
          expect(err).to.not.exist

          let createResult = await createPasswordReset(item.nickname)

          expect(createResult).to.eq(true)
          await Profile.findOne({ nickname: valid.nickname }).populate('passwordReset').then(async (profile) => {
            expect(profile.passwordReset).to.exist

            let confirmResult = await confirmPasswordReset(profile.nickname, profile.passwordReset.verificationToken, 'newpassword')
            expect(confirmResult).to.eq(true)
            Profile.findOne({ nickname: valid.nickname }).then(async (profile) => {
              expect(profile.passwordReset).to.not.exist
            })
          })

          done()
        })
      })
    }
  })
})