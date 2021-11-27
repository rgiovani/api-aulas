import supertest from "supertest"

import { app } from "../server"
import { disconnect } from "../utils/mongodb"

beforeAll(done => {
    done()
})

let currentUsersLength = 0
let currentUserId = ''

describe('Testing successful returns on users routes', () => {
    it('should test if its READING and Returning an ARRAY with STATUS 200', async () => {

        const res = await supertest(app).get('/users')
        currentUsersLength = res.body.length

        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toEqual(true)
    })

    it('should test if user are being CREATED and returning ID with STATUS 200', async () => {
        const res = await supertest(app).post('/users')
            .send({
                name: "novo",
                surname: "usuario",
                teacher: true
            })

        currentUsersLength++
        const result = await supertest(app).get('/users')
        currentUserId = res.body
        expect(res.statusCode).toEqual(200)
        expect(typeof res.body).toEqual('string')
    })

    it('should test if user are being UPDATED and returning TRUE with STATUS 200', async () => {
        const res = await supertest(app).put('/users')
            .send({
                _id: currentUserId,
                name: "Leonardo",
                surname: "Oliveira",
                teacher: false
            })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(true)
    })

    it('should test if user are becoming teacher', async () => {
        const res = await supertest(app).put('/users/becomeTeacher')
            .send({
                userId: currentUserId
            })

        const resUserNotFound = await supertest(app).put('/users/becomeTeacher')
            .send({
                userId: '619fe3a87832e9827bc13d6a'
            })

        const resUserInvalid = await supertest(app).put('/users/becomeTeacher')
            .send({
                userId: 123
            })

        const resAlreadyIsTeacher = await supertest(app).put('/users/becomeTeacher')
            .send({
                userId: currentUserId
            })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(true)

        expect(resUserNotFound.statusCode).toEqual(400)
        expect(resUserInvalid.statusCode).toEqual(400)
        expect(resAlreadyIsTeacher.statusCode).toEqual(400)
    })


    it('should test if user are being DELETED and returning TRUE with STATUS 200', async () => {
        const res = await supertest(app).del('/users')
            .send({
                id: currentUserId
            })

        currentUsersLength--
        const result = await supertest(app).get('/users')

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(true)
    })
})

describe('Testing Bad Requests (POST) on users Routes', () => {
    it('should test if STATUS 400 are being thrown when field NAME is missing', async () => {
        const res = await supertest(app).post('/users')
            .send({
                surname: "Giovani",
                teacher: true
            })
        expect(res.statusCode).toEqual(400)
    })

    it('should test if STATUS 400 are being thrown when field SURNAME is missing', async () => {
        const res = await supertest(app).post('/users')
            .send({
                name: "Ronaldo",
                teacher: true
            })
        expect(res.statusCode).toEqual(400)
    })

    it('should test if STATUS 400 are being thrown when field TEACHER is missing', async () => {
        const res = await supertest(app).post('/users')
            .send({
                name: "Ronaldo",
                surname: "Giovani"
            })
        expect(res.statusCode).toEqual(400)
    })

    it('should test if STATUS 400 are being thrown when request body is an EMPTY object', async () => {
        const res = await supertest(app).post('/users')
            .send({})
        expect(res.statusCode).toEqual(400)
    })

    it('should test if STATUS 400 are being thrown when user already exists', async () => {
        const result = await supertest(app).post('/users')
            .send({
                name: "adm",
                surname: "admin",
                teacher: false
            })

        const result2 = await supertest(app).post('/users')
            .send({
                _id: currentUserId,
                name: "adm",
                surname: "admin",
                teacher: false
            })

        expect(result2.statusCode).toEqual(400)

        await supertest(app).del('/users')
            .send({
                id: result.body
            })
    })
})

describe('Testing Bad Requests (PUT) on users Routes', () => {
    let currentUserId = ''
    it('should test if STATUS 400 are being thrown when field ID is missing', async () => {
        const userCreatedRes = await supertest(app).post('/users')
            .send({
                name: "Ronaldo",
                surname: "Giovani",
                teacher: true
            })
        currentUserId = userCreatedRes.body
        const res = await supertest(app).put('/users')
            .send({})
        expect(res.statusCode).toEqual(400)
    })

    it('should test if STATUS 400 are being thrown when field ID is invalid or NotFound', async () => {
        const resInvalidId = await supertest(app).put('/users')
            .send({
                _id: 123,
                name: "Leonardo",
                surname: "Oliveira",
                teacher: "61a0686f44b6046e0341f9f8"
            })


        expect(resInvalidId.statusCode).toEqual(400)
    })

    it('should test if STATUS 400 are being thrown when field NAME is missing', async () => {
        const res = await supertest(app).put('/users')
            .send({
                _id: currentUserId
            })
        expect(res.statusCode).toEqual(400)
    })

    it('should test if STATUS 400 are being thrown when field SURNAME is missing', async () => {
        const res = await supertest(app).post('/users')
            .send({
                _id: currentUserId,
                name: "Leonardo",
            })
        expect(res.statusCode).toEqual(400)
    })

    it('should test if STATUS 400 are being thrown when field TEACHER is missing', async () => {
        const res = await supertest(app).post('/users')
            .send({
                _id: currentUserId,
                name: "Leonardo",
                surname: "Oliveira"
            })
        expect(res.statusCode).toEqual(400)

        await supertest(app).del('/users')
            .send({
                id: currentUserId
            })

    })

})

describe('Testing Bad Requests (Delete) on users Routes', () => {
    it('should test if STATUS 400 are being thrown when field ID is missing', async () => {
        const res = await supertest(app).del('/users')
            .send({})
        expect(res.statusCode).toEqual(400)
    })

    it('should test if STATUS 400 are being thrown when field ID is invalid', async () => {
        const res = await supertest(app).del('/users')
            .send({ id: 0 })
        expect(res.statusCode).toEqual(400)
    })

    it('should test if STATUS 400 are being thrown when user doesnt exists', async () => {
        const res = await supertest(app).del('/users')
            .send({
                id: '61a134afe25628ef2b514aa1'
            })

        expect(res.statusCode).toEqual(400)
    })
})

afterAll(done => {
    disconnect()
    done()
})