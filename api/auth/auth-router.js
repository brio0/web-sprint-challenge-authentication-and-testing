const bcrypt = require('bcryptjs')
const router = require('express').Router();
const jwt = require('jsonwebtoken')
const User = require('../users/user-model')

const {
  checkUsernameFree,
  checkUsernameExist
} = require('./auth-middleware')

const { JWT_SECRET } = require('../../config')


router.post('/register', checkUsernameFree, (req, res, next) => {
  const { password, username } = req.body
  const user = req.body
  const hash = bcrypt.hashSync(password, 8)
  user.password = hash
  console.log(!username)
  if (password.trim().length === 0 || username.trim().length === 0 || !password || !username) {
    res.status(400).json({ message: "username and password required" })
  } else {
    User.add(user)
      .then(saved => {
        res.status(201).json(saved)
      })
      .catch(next)
  }

  // User.add(user)
  //   .then(saved => {
  //     if (!saved.username || !saved.password || saved.password.length < 3 || saved.username.length < 3) {
  //       res.json({ message: "username and password required" })
  //     } else {
  //       res.status(201).json(saved)
  //     }

  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })


  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', checkUsernameExist, (req, res, next) => {
  const { username, password } = req.body
  if (username.trim().length === 0 || password.trim().length === 0 || !username || !password) {
    res.status(400).json({ message: "username and password required" })
  } else {
    User.findBy({ username })
      .then(([user]) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = buildToken(user)
          res.status(200).json({ message: `welcome, ${user.username}`, token })
        } else {
          next({ status: 401, message: "invalid credentials" })
        }
      })
      .catch(next)
  }


  // if (bcrypt.compareSync(password, req.user.password)) {
  //   req.session.user = req.user
  //   const token = buildToken(req.user)
  //   res.json({ message: `welcome, ${req.user.username}`, token })
  // } else {
  //   next({ status: 401, message: "Invalid credentials" })
  // }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const options = {
    expiresIn: '1d',
  }
  return jwt.sign(payload, JWT_SECRET, options)
}

module.exports = router;
