const parser = require('accept-language-parser')
import container from './locale/container'
const localeService = container.resolve('localeService')
import { ApolloServer, gql, ApolloError } from 'apollo-server'
import jwt from 'jsonwebtoken'
import util from 'util'
import mongoose from 'mongoose'
import DBSeed from "./db/seeds/dbSeed"
import Rabbit from './rabbit'
import Const from './constants'

const { typeDefs } = require('./schema')
const { resolvers } = require('./resolvers')
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    var languages = parser.parse(req.headers["accept-language"]);
    
    if (languages.length) {
      localeService.setLocale(languages[0].code);
    }
    else {
      localeService.setLocale(Const.DEFAULT_LANGUAGE_CODE);
    }
/*
    console.log(localeService.getLocales()); // ['en', 'el']
    console.log(localeService.getCurrentLocale()); // 'en'
    console.log(localeService.translate('Hello')); //  'Hello'
    console.log(localeService.translatePlurals('You have %s message', 3)); // 'You have 3 messages'
*/
    const bearerToken = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null
    if (bearerToken) {
      try {
        const payload = await util.promisify(jwt.verify)(bearerToken, process.env.PROFILE_JWT_SECRET)
        return { user: payload.user }
      }
      catch (ex) {
        if (ex.name == 'TokenExpiredError') {
          throw new ApolloError(localeService.translate('TOKEN_EXPIRED'), 'TokenExpiredError')
        }

        throw ex
      }
    }
    return null
  },
})

var connectionstring = process.env.MONGODB_CONNECTION_STRING
mongoose.connect(connectionstring, {
  useCreateIndex: true,
  useNewUrlParser: true
},
  (err) => {
    if (err) {
      console.log(err)
    }
    //Dataseeds  
    DBSeed.seed()
  })
server.listen().then(({ url }) => {
  console.log(`Fixu Server ready at ${url}`)
})

new Rabbit().emailConsumer()
