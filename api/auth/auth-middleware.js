const User = require('../users/user-model')

async function checkUsernameFree(req, res, next) {
    try {
        const username = await User.findByUsername(req.body.username)
        if (!username) {
            return next()
        } else {
            return next({ message: "username taken", status: 401 })
        }
    } catch (err) {
        next(err)
    }
}
async function checkUsernameAndPasswordProvided(req, res, next) {
    try {
        if (!req.body.username || !req.body.password) {
            res.status(400).json({ message: "username and password required" })
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
}

async function checkUsernameExist(req, res, next) {
    try {
        const users = await User.findBy({ username: req.body.username })
        console.log('sd', users)
        if (users.length) {
            req.user = users[0]
            next()
        } else {
            next({ message: "invalid credentials", status: 401 })
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    checkUsernameFree,
    checkUsernameExist,
    checkUsernameAndPasswordProvided
}