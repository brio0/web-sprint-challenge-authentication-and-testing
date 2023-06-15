const User = require('../users/user-model')

async function checkUsernameFree(req, res, next) {
    try {
        const username = await User.findByUsername(req.body.username)

        if (!username) {
            return next()
        }
        else {
            return next({ "message": "username taken", status: 401 })
        }
    } catch (err) {
        next(err)
    }
    next()

}

async function checkUsernameExist(req, res, next) {
    try {
        const users = await User.findByUsername({ username: req.body.username })
        if (users) {
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
    checkUsernameExist
}