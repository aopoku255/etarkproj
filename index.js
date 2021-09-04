const express = require('express')
const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('./model/User')

const JWT_SECRET = 'hkajjhs%^%5U^%jbhjghjg!#5$$%jhjcxhjfdjdfhhkju54'

const mongodbURI =
  'mongodb+srv://aopoku6:Prof...0545098438@cluster0.1i6ij.mongodb.net/etark?retryWrites=true&w=majority'

mongoose
  .connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    throw err
  })

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log('SERVER STARTED ON PORT ' + port)
})

app.use(express.static(path.join(__dirname, 'public')))

// HOME ROUTE
app.get('/', (res, req) => {
  res.sendFile(path.join(__dirname, 'public/HTML', 'home.html'))
})

// SIGNUP ROUTE
app.post('/api/signup', async (req, res) => {
  const { username, password2 } = req.body
  const password = await bcrypt.hash(password2, 10)
  try {
    const response = await User.create({
      username,
      password,
    })
    res.json({ msg: 'user created' })
  } catch (error) {
    if (error.code === 11000) {
      res.json({ status: 11000, msg: 'username already exist' })
    }
  }
})

// LOGIN

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username }).lean()
  if (!user) {
    return res.json({ status: 400, msg: 'Username does not exist' })
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET
    )
    return res.json({ status: 'success', msg: token })
  }
  res.json({ status: 'error', msg: 'Invalid username or password' })
})

app.post('/api/home', (req, res) => {
  const { token } = req.body
  try {
    const user = jwt.verify(token, JWT_SECRET)
  } catch (error) {
    res.json({ status: 'error', msg: 'Forbidden' })
  }

  console.log(user)
})
