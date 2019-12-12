process.env['NODE_CONFIG_DIR'] = __dirname + '/config/'
require('@babel/register')
require('dotenv').config()
require('./src/server.js') 
require('./src/restapi.js') 