import { refreshToken } from './actions/profileOperations'
var cors = require('cors')
import Const from './constants'

const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const port = process.env.REST_API_PORT || 4002

app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))

app.listen(port, () => {
  console.log(`Rest API running at port ${port}`)
})

app.post(Const.REFRESH_ENDPOINT, (req, res) => {
  const body = req.body;

  if (body.refreshToken) {
    try {
      return refreshToken(body.refreshToken).then((mytoken) => {
        res.status(200).json(mytoken)
      })
    }
    catch (ex) {
      console.log(ex)
      res.status(401).json({
        token: null
      })
    }
  } else {
    res.status(401).json({
      token: null
    })
  }
})