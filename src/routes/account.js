const express = require('express')
const router = express.Router()
const userRepository = require('../repositories/account')

router.post('/register', async function (req, res) {
    const { user } = req.body

    try {
        const newUser = await userRepository.add(user)
        res.status(201).json({
            message: `Welcome to the game, ${newUser.username}!`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

router.post('/login', async function (req, res) {
    const { user } = req.body
    try {
        const token = await userRepository.authenticate(user.username, user.password)
        res.status(200).json({
            message: "Logged in successfully!",
            token
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router