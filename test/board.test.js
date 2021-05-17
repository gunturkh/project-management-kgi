/* eslint-disable no-undef */
const request = require('supertest')
const sinon = require('sinon')
const app = require('../src/app')
const Board = require('../src/models/board')
const mongoose = require('mongoose')
const { listOne, boardTwo, boardOne, boardOneId, boardTwoId, cardOne,
    setupBoard, setupList, setupCard, setupActivity, activityOne } = require('./fixtures/db')

afterEach(() => {
    sinon.restore()
})

describe('POST@/api/boards', () => {
    it('Should create a new board', async () => {
        await Board.deleteMany()
        await request(app).post('/api/boards').send(boardTwo).expect(200)
    })

    it('Should not create board without name', async () => {
        await request(app).post('/api/boards').send({}).expect(422)
    })

    it('Should not create board without imageColor', async () => {
        await request(app).post('/api/boards').send({ name: 'karma' }).expect(422)
    })

    it('Should return internal server error when mongoose fails to save', async () => {
        sinon.stub(mongoose.Model.prototype, 'save').rejects({})
        await request(app).post('/api/boards').send(boardTwo).expect(500)
    })
})

describe('Get@/api/boards', () => {
    it('Should show add the boards from db', async () => {
        const resp = await request(app).get('/api/boards').send().expect(200)
        const boardEntries = await Board.find({})
        expect(JSON.stringify(resp.body)).toEqual(JSON.stringify(boardEntries))
    })

    it('Should show empty board-db', async () => {
        await Board.deleteMany()
        const resp = await request(app).get('/api/boards').send().expect(200)
        const boardEntries = await Board.find({})
        expect(JSON.stringify(resp.body)).toEqual(JSON.stringify(boardEntries))
    })

    it('Should show server error - 500 internal server error', async () => {
        sinon.stub(mongoose.Model, 'find').rejects({})
        await request(app).get('/api/boards').send().expect(500)
    })
})

describe('Get@/api/boards/{id}', () => {
    it('Should display board on valid id', async () => {
        await setupBoard(boardOne)
        await request(app).get(`/api/boards/${boardOneId}`).send().expect(200)
    })

    it('Shouldn\'t display board on invalid id - 404', async () => {
        await request(app).get(`/api/boards/${boardTwoId}`).send().expect(404)
    })

    it('Should show server error - 500', async () => {
        sinon.stub(mongoose.Model, 'findById').rejects({})
        await request(app).get(`/api/boards/${boardOneId}`).send().expect(500)
    })

})

describe('Get@/api/boards/{id}/lists', () => {
    it('Should display all lists with valid boardId', async () => {
        await setupList(listOne, boardOne)
        await request(app).get(`/api/boards/${boardOneId}/lists`).send().expect(200)
    })

    it('Should show 404 on invalid boardId', async () => {
        await request(app).get(`/api/boards/${boardTwoId}/lists`).send().expect(404)
    })

    it('Should show server error on failure', async () => {
        sinon.stub(mongoose.Model, 'find').rejects({})
        await request(app).get(`/api/boards/${boardOneId}/lists`).send().expect(500)
    })

    it('Should show empty lists', async () => {
        await setupBoard(boardTwo)
        const resp = await request(app).get(`/api/boards/${boardTwoId}/lists`).send()
        expect(resp.body).toHaveLength(0)
    })
})

describe('Get@/api/boards/{id}/cards', () => {
    it('Should display all cards with valid boardId', async () => {
        await setupCard(cardOne, listOne, boardOne)
        await request(app).get(`/api/boards/${boardOneId}/cards`).send().expect(200)
    })

    it('Should show 404 on invalid boardId', async () => {
        await request(app).get(`/api/boards/${boardTwoId}/cards`).send().expect(404)
    })

    it('Should show server error on failure', async () => {
        sinon.stub(mongoose.Model, 'find').rejects({})
        await request(app).get(`/api/boards/${boardOneId}/cards`).send().expect(500)
    })

    it('Should show empty cards', async () => {
        await setupBoard(boardTwo)
        const resp = await request(app).get(`/api/boards/${boardTwoId}/cards`).send()
        expect(resp.body).toHaveLength(0)
    })
})

describe('Get@/api/boards/{id}/activities', () => {
    it('Should display all activities with valid boardId', async () => {
        await setupActivity(activityOne, boardOne)
        await request(app).get(`/api/boards/${boardOneId}/activities`).send().expect(200)
    })

    it('Should show 404 on invalid boardId', async () => {
        await request(app).get(`/api/boards/${boardTwoId}/activities`).send().expect(404)
    })

    it('Should show server error on failure', async () => {
        sinon.stub(mongoose.Model, 'find').rejects({})
        await request(app).get(`/api/boards/${boardOneId}/activities`).send().expect(500)
    })

    it('Should show empty activities', async () => {
        await setupBoard(boardTwo)
        const resp = await request(app).get(`/api/boards/${boardTwoId}/activities`).send()
        expect(resp.body).toHaveLength(0)
    })
})

describe('DELETE@/api/boards/{id}', () => {
    it('Should delete an existing board', async () => {
        await setupCard(cardOne, listOne, boardOne)
        await request(app).delete(`/api/boards/${boardOneId}`).send().expect(200)
    })

    it('Should show 404 on deleting of non-existant board', async () => {
        await request(app).delete(`/api/boards/${boardTwoId}`).send().expect(404)
    })

    it('Should return internal server error when mongoose fails to connect', async () => {
        sinon.stub(mongoose.Model, 'find').rejects({})
        await setupCard(cardOne, listOne, boardOne)
        await request(app).delete(`/api/boards/${boardOneId}`).send().expect(500)
    })
})

const updateBoard = {
    name: 'karma2',
    image: {
        color: 'green',
        full: 'sample2',
        thumb: 'image2_thumb',
    }
}

describe('PATCH@/api/boards/{id}', () => {
    it('Should update an existing board on all valid fields', async () => {
        await setupBoard(boardOne)
        await request(app).patch(`/api/boards/${boardOneId}`).send(updateBoard).expect(200)
    })

    it('Should not update, if board doesn\'t exist', async () => {
        await request(app).patch(`/api/boards/${boardTwoId}`).send(updateBoard).expect(404)
    })

    it('Should not update board on invalid fields like  _id', async () => {
        await request(app).patch(`/api/boards/${boardOneId}`).send({ _id: boardTwoId }).expect(400)
    })

    it('Should return internal server error when mongoose fails to connect', async () => {
        sinon.stub(mongoose.Model, 'findByIdAndUpdate').rejects({})
        await request(app).patch(`/api/boards/${boardOneId}`).send(updateBoard).expect(500)
    })
})