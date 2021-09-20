const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userRepository = function() {
    const uri = 'mongodb://admin:pass1234@localhost:27017'

    const getAll = function() {
        return new Promise(async (reject, resolve) => {
            try {
                await mongoose.connect(uri)
                const users = await User.find()
                resolve(users)
            } catch (error) {
                reject(error)
            }
        })
    }

    const getById = function(id) {
        return new Promise(async (reject, resolve) => {
            try {
                await mongoose.connect(uri)
                const user = await User.findOneById(id)
                resolve(user)
            } catch (error) {
                reject(error)
            }
        })
    }

    const add = function(user) {
        return new Promise(async (resolve, reject) => {
            try {
                await mongoose.connect(uri)
                const hashedPassword = await bcrypt.hash(user.password, 15)
                const insertedUser = new User({
                    username: user.username,
                    password: hashedPassword
                })
                await insertedUser.save()
                resolve(insertedUser)
            } catch (error) {
                reject(error)
            }
        })
    }

    const edit = function(id, user) {
        return new Promise(async (resolve, reject) => {
            try {
                await mongoose.connect(uri)
                const updatedUser = findOneAndReplace({_id: id, username: user.username})
                await updatedUser.save()
                resolve(updatedUser.username)
            } catch (error) {
                reject(error)
            }
        })
    }

    const remove = function(id) {
        return new Promise(async (resolve, reject) => {
            try {
                await mongoose.connect(uri)
                const removedUser = await User.findOneAndDelete({_id: id})
                resolve(removedUser._id)
            } catch (error) {
                reject(error)
            }
        })
    }

    const authenticate = function(username, password) {
        return new Promise(async (resolve, reject) => {
            try {
                await mongoose.connect(uri)
                const user = await User.findOne({username})

                if( !user ) {
                    reject("There is no user with that username")
                }

                const pass = await bcrypt.compare(password, user.password)

                if( !pass ) {
                    reject("Incorrect Password")
                }

                const token = jwt.sign({username, password}, 'NotSoSecret', { algorithm: 'HS256' })

                resolve(token)
            } catch (error) {
                reject(error)
            }
        })
    }

    return { getAll, getById, add, edit, remove, authenticate }
}

module.exports = userRepository()