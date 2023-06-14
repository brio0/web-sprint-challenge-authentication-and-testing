const router = require('express').Router()

const User = require('./user-model')

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (err) {
        next()
    }
})



module.exports = router