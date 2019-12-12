import { expect } from 'chai'
import config from 'config'
import Database from '../../db'
import Profile from './profileModel'
import Tip from './tipModel'
import { createTip, getTip, updateTip, deleteTip, getAllTips } from '../../actions/tipOperations'

var runIntegrationTests = (process.env.INTEGRATION_TESTS == 'true')

if (runIntegrationTests) {
  new Database().connect()
}

describe('Database models', (done) => {
  /* Done before every test execution */
  beforeEach(async () => {
    await Tip.deleteMany({})
  })

  /* Done after all tests are executed */
  after(async () => {
    await Tip.deleteMany({})
  })

  describe('Tip', () => {
    if (runIntegrationTests) {
      it('Should fail with invalid tip', (done) => {
        var invalid = new Tip()
        invalid.validate((err) => {
          expect(err.errors.title).to.exist
          expect(err.errors.description).to.exist
          expect(err.errors.visibleDate).to.exist
          done()
        })
      })

      it('Should fail with invalid date', (done) => {
        var invalid = new Tip({
          title: 'test',
          description: 'testcription',
          enabled: true,
          visibleDate: 'invaliddate'
        })
        invalid.validate((err) => {
          expect(err.errors.visibleDate).to.exist
          done()
        })
      })

      it('Should create new tip', (done) => {
        var valid = new Tip({
          title: 'test',
          description: 'testcription',
          enabled: true,
          visibleDate: '2019-10-10'
        })

        var user = new Profile({
          _id: '5d9dbdfc7a65f92f6c9c7754',
          firstName: 'test',
          lastName: 'person',
          normalizedNickName: 'NIKKI',
          nickname: 'Nikki',
          password: '12345',
          salt: '12345',
          email: 'foo1@bar.com'
        })

        createTip({ tip: valid }, user).then((tip) => {
          expect(tip.title).to.eq('test')
          expect(tip.description).to.eq('testcription')
          expect(tip.enabled).to.eq(true)
          expect(tip.visibleDate.toISOString()).to.equal('2019-10-10T00:00:00.000Z')

          done()
        })
      })

      it('Should get tip', (done) => {
        var valid = new Tip({
          title: 'test',
          description: 'testcription',
          enabled: true,
          visibleDate: '2019-10-10'
        })

        var user = new Profile({
          _id: '5d9dbdfc7a65f92f6c9c7754',
          firstName: 'test',
          lastName: 'person',
          normalizedNickName: 'NIKKI',
          nickname: 'Nikki',
          password: '12345',
          salt: '12345',
          email: 'foo1@bar.com'
        })

        createTip({ tip: valid }, user).then((tip) => {
          expect(tip.title).to.eq('test')
          expect(tip.description).to.eq('testcription')
          expect(tip.enabled).to.eq(true)
          expect(tip.visibleDate.toISOString()).to.equal('2019-10-10T00:00:00.000Z')

          getTip(tip).then((result) => {
            expect(result._id.id.toString()).to.eq(tip._id.id.toString())

            done()
          })
        })
      })

      it('Should get tips', (done) => {
        var valid = new Tip({
          title: 'test',
          description: 'testcription',
          enabled: true,
          visibleDate: '2019-10-10'
        })

        var valid2 = new Tip({
          title: 'test',
          description: 'testcription',
          enabled: true,
          visibleDate: '2019-10-09'
        })

        var user = new Profile({
          _id: '5d9dbdfc7a65f92f6c9c7754',
          firstName: 'test',
          lastName: 'person',
          normalizedNickName: 'NIKKI',
          nickname: 'Nikki',
          password: '12345',
          salt: '12345',
          email: 'foo1@bar.com'
        })

        createTip({ tip: valid }, user).then((tip1) => {
          expect(tip1.title).to.eq('test')
          expect(tip1.description).to.eq('testcription')
          expect(tip1.enabled).to.eq(true)
          expect(tip1.visibleDate.toISOString()).to.equal('2019-10-10T00:00:00.000Z')

          createTip({ tip: valid2 }, user).then((tip2) => {
            expect(tip2.title).to.eq('test')
            expect(tip2.description).to.eq('testcription')
            expect(tip2.enabled).to.eq(true)
            expect(tip2.visibleDate.toISOString()).to.equal('2019-10-09T00:00:00.000Z')

            getAllTips([]).then((result) => {
              expect(result.length).to.eq(2)

              getAllTips({ filter: { date: '2019-10-10' } }).then((result2) => {
                expect(result2.length).to.eq(1)

                done()
              })
            })
          })
        })
      })

      it('Should update a tip', (done) => {
        var valid = new Tip({
          title: 'test',
          description: 'testcription',
          enabled: true,
          visibleDate: '2019-10-10'
        })

        var user = new Profile({
          _id: '5d9dbdfc7a65f92f6c9c7754',
          firstName: 'test',
          lastName: 'person',
          normalizedNickName: 'NIKKI',
          nickname: 'Nikki',
          password: '12345',
          salt: '12345',
          email: 'foo1@bar.com'
        })

        createTip({ tip: valid }, user).then((tip) => {
          expect(tip.title).to.eq('test')
          expect(tip.description).to.eq('testcription')
          expect(tip.enabled).to.eq(true)
          expect(tip.visibleDate.toISOString()).to.equal('2019-10-10T00:00:00.000Z')

          tip.title = 'updated'
          updateTip({ tip: tip }, user).then((updateResult) => {
            expect(updateResult.title).to.eq('updated')

            done()
          })
        })
      })

      it('Should fail to delete a tip', (done) => {
        var valid = new Tip({
          title: 'test',
          description: 'testcription',
          enabled: true,
          visibleDate: '2019-10-10'
        })

        var user = new Profile({
          _id: '5d9dbdfc7a65f92f6c9c7754',
          firstName: 'test',
          lastName: 'person',
          normalizedNickName: 'NIKKI',
          nickname: 'Nikki',
          password: '12345',
          salt: '12345',
          email: 'foo1@bar.com'
        })

        createTip({ tip: valid }, user).then(async (tip) => {
          expect(tip.title).to.eq('test')
          expect(tip.description).to.eq('testcription')
          expect(tip.enabled).to.eq(true)
          expect(tip.visibleDate.toISOString()).to.equal('2019-10-10T00:00:00.000Z')

          await Tip.deleteMany({})

          deleteTip(tip).catch((err) => {
            expect(err).to.exist
            
            done()
          })
        })
      })

      it('Should delete a tip', (done) => {
        var valid = new Tip({
          title: 'test',
          description: 'testcription',
          enabled: true,
          visibleDate: '2019-10-10'
        })

        var user = new Profile({
          _id: '5d9dbdfc7a65f92f6c9c7754',
          firstName: 'test',
          lastName: 'person',
          normalizedNickName: 'NIKKI',
          nickname: 'Nikki',
          password: '12345',
          salt: '12345',
          email: 'foo1@bar.com'
        })

        createTip({ tip: valid }, user).then((tip) => {
          expect(tip.title).to.eq('test')
          expect(tip.description).to.eq('testcription')
          expect(tip.enabled).to.eq(true)
          expect(tip.visibleDate.toISOString()).to.equal('2019-10-10T00:00:00.000Z')

          deleteTip(tip).then((updateResult) => {
            expect(updateResult.title).to.eq('test')

            getAllTips([]).then((result) => {
              expect(result.length).to.eq(0)

              done()
            })
          })
        })
      })
    }
  })
})