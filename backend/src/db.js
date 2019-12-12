import mongoose from 'mongoose'
import config from 'config'

class Database {
  connect() {
    //db options
    let options = { 
      connectTimeoutMS: 30000,
      keepAlive: 1,
      useNewUrlParser: true,
      useCreateIndex: true
    } 
    let useCI = (process.env.CI_TESTING == 'true')
    let connectionString = useCI ? config.travis_connectionstring : config.connectionstring
    mongoose.connect(connectionString, options)
    let db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'))
  }
}
export default Database