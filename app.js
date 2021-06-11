const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')
const { notFoundHandler, errorHandler } = require('./middleware')
const boardHandler = require('./api/boardHandler')
const listHandler = require('./api/listHandler')
const cardHandler = require('./api/cardHandler')
const timelineHandler = require('./api/timelineHandler')
const userHandler = require('./api/userHandler')
const activityHandler = require('./api/activityHandler')
const companyHandler = require('./api/companyHandler')

const upload = multer({
    limits: {
        fileSize: 10000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            cb(new Error('Please upload an image.'))
        }
        cb(undefined, true)
    },
})
const app = express()

console.log(`database ${process.env.DATABASE_URL}`)
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})

app.use(morgan('tiny'))
app.use(helmet())

app.use(express.json())
app.use('/api/user/', userHandler)
app.use('/api/boards/', boardHandler)
app.use('/api/lists/', listHandler)
app.use('/api/cards/', cardHandler)
app.use('/api/timelines/', timelineHandler)
app.use('/api/activities/', activityHandler)
app.use('/api/company/', companyHandler)
app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
})
app.use(errorHandler)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build/index.html'))
    })
}

app.use(notFoundHandler)

module.exports = app
