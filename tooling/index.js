const express = require('express')
const app = express()
app.use(express.json());

app.get('/', function (req, res) {
  console.log(req)
  res.send('for sanity!')
})

app.post('/', function (req, res) {
    console.log(req.body)
    res.send(':ok_hand:')
  })
  

app.listen(3000, () => console.log('waiting for anything on 3000'))