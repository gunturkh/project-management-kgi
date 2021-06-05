const { Router } = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { auth } = require('../middleware')
const router = Router()

// register a new user
router.post('/register', async (req, res, next) => {
    const { password, passwordCheck, username, userRole, role } = req.body
    try {
        if (!password || !passwordCheck || !username || !userRole || !role)
            return res
                .status(400)
                .json({ msg: 'Don\'t be lazy 🦥, enter all fields value' })

        if (password.length < 5) {
            return res
                .status(400)
                .json({ msg: 'Password is too small, try harder 🤪' })
        }
        if (password != passwordCheck)
            return res.status(400).json({ msg: 'Password don\'t match 👿' })
        if (userRole !== 'ADMIN')
            return res.status(400).json({ msg: 'You\'re not authorized' })

        const existingUser = await User.findOne({ username })
        if (existingUser)
            return res
                .status(400)
                .json({ msg: 'Username exists, think of something unique 🦄' })

        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)
        const newUser = new User({ username, password: passwordHash, role })
        const response = await newUser.save()
        res.send({
            username: response.username,
            _id: response._id,
            role: response.role,
        })
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(422)
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body
    try {
        if (!username || !password)
            return res
                .status(400)
                .json({ msg: 'Don\'t be lazy 🦥, enter all fields value' })

        const user = await User.findOne({ username })
        if (!user) return res.status(400).json({ msg: 'User doesn\'t exist 🙈' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(400).json({ msg: 'Invalid Credentials 🤕' })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        })
    } catch (error) {
        next(error)
    }
})

router.post('/tokenIsValid', async (req, res, next) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) return res.json(false)

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) return res.json(false)

        const user = await User.findById(verified.id)
        if (!user) return res.json(false)

        return res.json(true)
    } catch (error) {
        next(error)
    }
})

router.get('/', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user)
        if (!user) return res.status(404).send()
        res.json({
            username: user.username,
            id: user._id,
        })
    } catch (error) {
        next(error)
    }
})

//get all users
router.post('/list', auth, async (req, res, next) => {
    try {
        const { role } = req.body
        const token = req.header('x-auth-token')
        console.log('req.body:', req.body)
        console.log('token:', token)
        if (!token) return res.json(false)
        // console.log('req.body:', req)
        if (role !== 'ADMIN')
            return res
                .status(400)
                .json({ msg: 'You are not authorized to view this info' })

        const user = await User.find({})
        res.json(user)
    } catch (error) {
        next(error)
    }
})

router.patch('/update', async (req, res, next) => {
    const { username, newPassword, newPasswordCheck, role } = req.body
    try {
        if (!username || !newPassword || !newPasswordCheck)
            return res
                .status(400)
                .json({ msg: 'Don\'t be lazy 🦥, enter all fields value' })

        if (newPassword != newPasswordCheck)
            return res.status(400).json({ msg: 'New Password don\'t match 👿' })
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(newPassword, salt)
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { password: passwordHash, role },
            { new: true, runValidators: true }
        )

        res.send(updatedUser)
    } catch (error) {
        next(error)
    }
})

// delete user based on id
router.delete('/:id', auth, async (req, res, next) => {
    const _id = req.params.id
    console.log('deleted user id: ', _id)
    try {
        const user = await User.findOneAndDelete({ _id })
        if (!user) return res.status(404).send()
        // find all lists within user and delete them as well
        const userList = await User.find({})
        console.log('deleted user list: ', userList)
        res.send(userList)
    } catch (error) {
        next(error)
    }
})

module.exports = router
