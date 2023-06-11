const User = require('../users/user-model')

async function checkUsernameFree(req, res, next) {
    try {
        const users = await User.findById({ username: req.body.username })
        if (!users.length) {
            next()
        }
        else {
            next({ "message": "username taken" })
        }
    } catch (err) {
        next(err)
    }
    next()

}

module.exports = {
    checkUsernameFree
}