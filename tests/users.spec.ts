
import supertest from "supertest"
import { app } from "../server"
import { disconnect } from "../utils/mongodb"

beforeAll(done => {
    done()
})

let currentUsersLength = 0
let currentUserId = ''

describe('Testing Users Routes', () => {
    it('should test if its READING and Returning an ARRAY with STATUS 200', async () => {
        const res = await supertest(app).get('/users')
        currentUsersLength = res.body.length

        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(res.body)).toEqual(true)
    })

    it('should test if user are being CREATED and returning ID with STATUS 200', async () => {
        const res = await supertest(app).post('/users')
            .send({
                name: "Ronaldo",
                surname: "Giovani",
                teacher: true
            })

        currentUsersLength++
        const result = await supertest(app).get('/users')
        currentUserId = res.body
        expect(res.statusCode).toEqual(200)
        expect(typeof res.body).toEqual('string')
        expect(result.body.length).toEqual(currentUsersLength)
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


    it('should test if user are being DELETED and returning TRUE with STATUS 200', async () => {
        const res = await supertest(app).del('/users')
            .send({
                id: currentUserId
            })

        currentUsersLength--
        const result = await supertest(app).get('/users')

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(true)
        expect(result.body.length).toEqual(currentUsersLength)
    })
})

afterAll(done => {
    disconnect()
    done()
})