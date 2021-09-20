const { verify } = require('jsonwebtoken')

module.exports = async function(req, res, next) {
    try {
        const { token } = req.headers
        
        if(!token) {
            res.status(403).send({
                message: "Must Provide JWT Token"
            })
        }

        await verify(token)
        next()
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}