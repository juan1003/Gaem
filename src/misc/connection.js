const mongoose = require('mongoose')

module.exports = function () {
    mongoose.connect('mongodb://root:pass1234@localhost:27017/gaem')

    const Ship = mongoose.model('Ship', {
        name: String,
        size: String
    })
    
    const falcong = new Ship({
        name: 'Falcon G',
        size: 'small'
    })

    falcong.save().then(() => console.log('First Ship has been created!'))
}