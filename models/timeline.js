const mongoose = require('mongoose')
const { Schema } = mongoose

const timelineSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        groupId: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        },
        start: {
            type: Schema.Types.Date,
            required: true,
        },
        end: {
            type: Schema.Types.Date,
            required: true,
        },
        boardId: {
            type: Schema.Types.ObjectId,
            ref: 'board',
            required: true,
        },
        order: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('timeline', timelineSchema)