/* eslint-disable no-undef */
const request = require('supertest')
const app = require('../src/app')
const sinon = require('sinon')
const mongoose = require('mongoose')
const List = require('../src/models/list')
const { boardOneId, boardOne, boardTwo, boardTwoId,
    listOne, listTwo, listOneId, listTwoId, cardOne,
    setupList, setupCard, setupBoard } = require('./fixtures/db')


afterEach(() => {
    sinon.restore()
})


describe('POST@/api/lists', () => {
    it('Should create a new list', async () => {
        await setupBoard(boardOne)
        await request(app).post('/api/lists').send(listOne).expect(200)
    })

    it('Should not create list without any data', async () => {
        await request(app).post('/api/lists').send({}).expect(422)
    })

    it('Should not create list without name', async () => {
        await request(app).post('/api/lists').send({ boardId: boardOneId }).expect(422)
    })

    it('Should not create list without boardId', async () => {
        await request(app).post('/api/lists').send({ name: 'listTestOne' }).expect(422)
    })

    it('Should not create list with invalid boardId', async () => {
        await request(app).post('/api/lists').send({ name: 'listTestOne', boardId: 'randomBoardId' }).expect(422)

    })

    it('Should return internal server error when mongoose fails to save', async () => {
        await setupBoard(boardTwo)
        sinon.stub(mongoose.Model.prototype, 'save').rejects({})
        await request(app).post('/api/lists').send(listTwo).expect(500)
    })

})

describe('Get@/api/lists', () => {
    it('Should show all lists', async () => {
        const resp = await request(app).get('/api/lists').send().expect(200)
        const listEntries = await List.find({})
        expect(JSON.stringify(resp.body)).toEqual(JSON.stringify(listEntries))
    })

    it('Should show empty list-db', async () => {
        await List.deleteMany()
        const resp = await request(app).get('/api/lists').send().expect(200)
        const listEntries = await List.find({})
        expect(JSON.stringify(resp.body)).toEqual(JSON.stringify(listEntries))
    })

    it('Should show server error - 500 internal server error', async () => {
        sinon.stub(mongoose.Model, 'find').rejects({})
        await request(app).get('/api/lists').send().expect(500)
    })
})

describe('Get@/api/lists/{id}', () => {
    it('Should display list on valid id', async () => {
        await setupList(listOne, boardOne)
        await request(app).get(`/api/lists/${listOneId}`).send().expect(200)
    })

    it('Shouldn\'t display list on invalid id - 404', async () => {
        await request(app).get(`/api/lists/${listTwoId}`).send().expect(404)
    })

    it('Should show server error - 500', async () => {
        sinon.stub(mongoose.Model, 'findById').rejects({})
        await request(app).get(`/api/lists/${listOneId}`).send().expect(500)
    })

})


describe('Get@/api/lists/{id}/cards', () => {
    it('Should display all lists with valid listId', async () => {
        await setupCard(cardOne, listOne, boardOne)
        await request(app).get(`/api/lists/${listOneId}/cards`).send().expect(200)
    })

    it('Should show 404 on invalid listId', async () => {
        await request(app).get(`/api/lists/${listTwoId}/cards`).send().expect(404)
    })

    it('Should show server error on failure', async () => {
        sinon.stub(mongoose.Model, 'find').rejects({})
        await request(app).get(`/api/lists/${listOneId}/cards`).send().expect(500)
    })

    it('Should show empty cards', async () => {
        await setupList(listTwo, boardTwo)
        const resp = await request(app).get(`/api/lists/${listTwoId}/cards`).send()
        expect(resp.body).toHaveLength(0)
    })

})

const updateList = {
    name: 'sampleList',
    order: 'zza'
}

describe('PATCH@/api/lists/{id}', () => {
    it('Should update an existing list on all valid fields', async () => {
        await setupList(listOne, boardOne)
        await request(app).patch(`/api/lists/${listOneId}`).send(updateList).expect(200)
    })

    it('Should not update, if list doesn\'t exist', async () => {
        await request(app).patch(`/api/lists/${listTwoId}`).send(updateList).expect(404)
    })

    it('Should not update list on invalid fields like boardId, _id', async () => {
        await request(app).patch(`/api/lists/${listOneId}`).send({ boardId: boardTwoId, _id: listTwoId }).expect(400)
    })

    it('Should return internal server error when mongoose fails to connect', async () => {
        sinon.stub(mongoose.Model, 'findByIdAndUpdate').rejects({})
        await request(app).patch(`/api/lists/${listOneId}`).send(updateList).expect(500)
    })
})

describe('DELETE@/api/lists/{id}', () => {
    it('Should delete an existing lists', async () => {
        await setupCard(cardOne, listOne, boardOne)
        await request(app).delete(`/api/lists/${listOneId}`).send().expect(200)
    })

    it('Should show 404 on deleting of non-existant lists', async () => {
        await request(app).delete(`/api/lists/${listTwoId}`).send().expect(404)
    })

    it('Should return internal server error when mongoose fails to connect', async () => {
        sinon.stub(mongoose.Model, 'find').rejects({})
        await setupCard(cardOne, listOne, boardOne)
        await request(app).delete(`/api/lists/${listOneId}`).send().expect(500)
    })
})