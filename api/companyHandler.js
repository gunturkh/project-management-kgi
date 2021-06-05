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

module.exports = router