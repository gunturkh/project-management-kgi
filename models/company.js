const mongoose = require('mongoose')
const { Schema } = mongoose

const companySchema = new Schema ({
companyName: {
        type: String,
        required: true,
        unique: true,
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true,
    },
    companyAddress: {
        type: String,
        required: true,
        unique: true,
    },
    companyLogo: {
        type: String,
        // required: true,
        unique: true,
    },
})

module.exports = mongoose.model('company', companySchema)