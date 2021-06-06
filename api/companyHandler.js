const {Router} = require('express')
const Company = require('../models/company')
const {auth} = require('../middleware')
const router = Router()

//fetch all company
router.get('/', auth, async (req, res, next) => {
    try {
        const companyList = await Company.find({})
        res.json(companyList)
    }
    catch (error) {
        console.log(error)
        next(error)
    }
})

//create new company
router.post('/', async (req, res, next) => {
    try{
        const company = new Company(req.body)
        const respData = await company.save()
        res.send(respData)    
    }
    catch (error) {
        if (error.name === 'ValidationError') res.status(422)
        next(error)
    }
})

//delete company based on id
router.delete('/:id', auth, async (req, res, next) => {
    const _id = req.params.id
    try {
        await Company.findOneAndDelete({ _id})
        const company = await Company.find({})
        res.send(company)
    }
    catch (error) {
        next(error)
    }
})

// update company content based on id
router.patch('/:id', auth, async (req, res,next) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = [
        'companyName',
        'companyEmail',
        'companyAddress',
        'companyLogo',
    ]
    console.log('update?', updates)
    const isValidOperation = updates.every((update) => {
        console.log('update?', update)
        return allowedUpdates.includes(update)
    })
    console.log('isValidOperation?', isValidOperation)
    if (!isValidOperation)
        return res.status(400).send({ error: 'Invalid updates!'})
    try {
        await Company.findOneAndUpdate(
            {_id},
            req.body,
            { new:true, runValidators:true }
        )
        const company = await Company.find({})
        if (!company) return res.status(404).send({error: 'Company not found!'})
        res.send(company)
    }
    catch (error) {
        next(error)
    }
})

module.exports = router