const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const Store = require('connect-session-knex')(session);
const knex = require('../data/dbConfig')

const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');
const usersRouter = require('./users/user-router.js')


const server = express();

server.use(session({
    name: "chocolatechip",
    secret: 'shh',
    saveUninitialized: false,
    resave: false,
    store: new Store({
        knex,
        createTable: true,
        clearInterval: 1000 * 60 * 10,
        tablename: 'sessions',
        sidfiename: 'sid',
    }),
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: false,
        httpOnly: true,
        // sameSite: 'none' 

    }

}))

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!
server.use('/api/users', usersRouter)

server.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        stack: err.stack
    })
})


module.exports = server;
