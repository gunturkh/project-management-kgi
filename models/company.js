const mongoose = require('mongoose')
const { Schema } = mongoose

const companySchema = new Schema({
    companyName: {
        type: String,
        required: true,
    },
    companyEmail: {
        type: String,
        required: true,
    },
    companyAddress: {
        type: String,
        required: true,
    },
    companyLogo: {
        type: String,
    },
})

module.exports = mongoose.model('company', companySchema)

