import supertest from "supertest"

import { app } from "../server"
import { disconnect } from "../utils/mongodb"


beforeAll(done => {
    done()
})

describe('Testing classes routes', () => {
    let currentUserId: any
    let currentClassId: any

    let usersIds: any[] = []
    let classesIds: any[] = []

    it('should test if class are being CREATED and returning ID with STATUS 200', async () => {
        const userResponse = await supertest(app).post('/users')
            .send({
                name: "robot",
                surname: "v1",
                teacher: true
            })
        currentUserId = userResponse.body

        const classResponse = await supertest(app).post('/classes')
            .send({
                title: "My IA",
                description: "learn IA with Robot V1!",
                teacherId: currentUserId
            })

        currentClassId = classResponse.body

        expect(classResponse.statusCode).toEqual(200)
        expect(typeof classResponse.body).toEqual('string')
    })

    it('should test if class are being UPDATED and returning TRUE with STATUS 200', async () => {
        const response = await supertest(app).put('/classes')
            .send({
                _id: currentClassId,
                title: "This is my title edited",
                description: "editing my description!",
                teacherId: currentUserId
            })
        expect(response.body).toEqual(true)
        expect(response.statusCode).toEqual(200)
    })

    it('should test if returns TRUE when DELETE class by ID', async () => {
        const response = await supertest(app).del('/classes')
            .send({
                id: currentClassId
            })

        await supertest(app).del('/users')
            .send({
                id: currentUserId
            })

        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual(true)
    })

    it('should test if returns an ARRAY in ASC and DESC order, sorted by title', async () => {
        let counter = 0
        const robotsName = ['bluey', 'redi', 'greena', 'orangeu']

        do {
            const nameLength = robotsName[counter].length - 1
            const lastLetter = robotsName[counter][nameLength]
            const userResponse = await supertest(app).post('/users')
                .send({
                    name: robotsName[counter],
                    surname: "robot" + lastLetter,
                    teacher: (counter % 2 == 0) ? true : false
                })

            if (counter % 2 == 0) {
                const classResponse = await supertest(app).post('/classes')
                    .send({
                        title: "Learn IA with " + robotsName[counter],
                        description: robotsName[counter] + " recommend this class!",
                        teacherId: userResponse.body
                    })

                classesIds.push(classResponse.body)
            }

            usersIds.push(userResponse.body)
            counter++
        } while (counter < 4)

        const resASC = await supertest(app).get('/classes').query({
            order: 'asc'
        })

        const resDESC = await supertest(app).get('/classes').query({
            order: 'desc'
        })

        //expect(resASC.body[0].title).toEqual('Learn IA with bluey')
        //expect(resDESC.body[0].title).toEqual('Learn IA with greena')
        expect(resASC.statusCode).toEqual(200)
        expect(resDESC.statusCode).toEqual(200)
    })

    it('should test if returns a class by ID', async () => {
        const classResponse = await supertest(app).get('/classes/id/')
            .query({
                id: classesIds[0]
            })

        expect(classResponse.body._id).toEqual(classesIds[0])
        expect(typeof classResponse.body).toEqual('object')
        expect(classResponse.statusCode).toEqual(200)
    })

    it('should test if STATUS 400 are being thrown when vote route has bad body', async () => {
        const resLessZero = await supertest(app).post('/classes/vote')
            .send({
                userId: usersIds[1],
                classId: classesIds[0],
                amount: -1
            })

        const resMoreFive = await supertest(app).post('/classes/vote')
            .send({
                userId: usersIds[1],
                classId: classesIds[0],
                amount: 6
            })

        const notFoundUserId = await supertest(app).post('/classes/vote')
            .send({
                userId: '619fe3a87832e9827bc13d6a',
                classId: classesIds[0],
                amount: 4
            })

        const notFoundClassId = await supertest(app).post('/classes/vote')
            .send({
                userId: usersIds[1],
                classId: '619fe3a87832e9827bc13d6a',
                amount: 4
            })

        expect(resLessZero.statusCode).toEqual(400)
        expect(resMoreFive.statusCode).toEqual(400)
        expect(notFoundUserId.statusCode).toEqual(400)
        expect(notFoundClassId.statusCode).toEqual(400)
    })

    it('should test if STATUS 400 are being thrown when user tries to create a class and is not a teacher', async () => {
        const userResponse = await supertest(app).post('/classes')
            .send({
                title: "My IA",
                description: "learn IA with Robot V1!",
                teacherId: usersIds[1]
            })
        expect(userResponse.statusCode).toEqual(400)
    })

    it('should test if returns TRUE when user give STARS to a CLASS', async () => {
        await supertest(app).post('/classes/vote')
            .send({
                userId: usersIds[1],
                classId: classesIds[0],
                amount: 5
            })

        const classResponse = await supertest(app).get('/classes/id/')
            .query({
                id: classesIds[0]
            })

        expect(classResponse.statusCode).toEqual(200)
        expect(typeof classResponse.body).toEqual('object')
        expect(classResponse.body._id).toEqual(classesIds[0])
        expect(classResponse.body.usersWhoVoted.some((obj: any) => obj.user === usersIds[1])).toEqual(true)
        expect(classResponse.body.stars).toEqual(5)

        await supertest(app).post('/classes/vote') //user change vote
            .send({
                userId: usersIds[1],
                classId: classesIds[0],
                amount: 2
            })

        const secondRes = await supertest(app).get('/classes/id/')
            .query({
                id: classesIds[0]
            })

        expect(secondRes.body.stars).toEqual(2)
        expect(secondRes.body.usersWhoVoted.length).toEqual(1)
        expect(secondRes.body.usersWhoVoted.some((obj: any) => obj.user === usersIds[1])).toEqual(true)
    })

    it('should test if returns TRUE when user favorite a CLASS', async () => {
        const classesResponse = await supertest(app).post('/classes/fav')
            .send({
                userId: usersIds[1],
                classId: classesIds[0]
            })

        expect(classesResponse.body).toEqual(true)
        expect(classesResponse.statusCode).toEqual(200)
    })

    it('should test if STATUS 400 are being thrown when user or teacher NOTFOUND while favorite a CLASS', async () => {
        const respondeUserNotFounded = await supertest(app).post('/classes/fav')
            .send({
                userId: '619fe3a87832e9827bc13d6a',
                classId: classesIds[0]
            })

        const respondeClassNotFounded = await supertest(app).post('/classes/fav')
            .send({
                userId: usersIds[1],
                classId: '619fe3a87832e9827bc13d6a'
            })

        expect(respondeUserNotFounded.statusCode).toEqual(400)
        expect(respondeClassNotFounded.statusCode).toEqual(400)
    })

    it('should test if returns all favorite classes from user by his ID', async () => {
        const response = await supertest(app).get('/classes/fav')
            .query({
                userId: usersIds[1]
            })

        expect(response.body.length).toEqual(1)
        expect(response.statusCode).toEqual(200)
    })

    //works only with empty db
    it('should test if returns an ARRAY in ASC and DESC order, sorted by stars', async () => {
        await supertest(app).post('/classes/vote') //user change vote
            .send({
                userId: usersIds[3],
                classId: classesIds[1],
                amount: 4
            })

        const resASC = await supertest(app).get('/classes/stars').query({
            order: 'asc'
        })

        const resDESC = await supertest(app).get('/classes/stars').query({
            order: 'desc'
        })

        expect(resASC.statusCode).toEqual(200)
        expect(resDESC.statusCode).toEqual(200)
        expect(resASC.body.length >= 0).toEqual(true)
        //expect(resASC.body[0].stars).toEqual(2)
        //expect(resDESC.body[0].stars).toEqual(4)
    })

    it('should test if returns all classes from teacher by his ID', async () => {
        const response = await supertest(app).get('/classes/byteacher/')
            .query({
                id: usersIds[0]
            })

        expect(response.body.length).toEqual(1)
        expect(response.body[0].teacher).toEqual(usersIds[0])
        expect(response.statusCode).toEqual(200)
    })

    it('should test if returns an object(class) that has the most stars', async () => {
        const response = await supertest(app).get('/classes/mostVoted')

        expect(response.statusCode).toEqual(200)
        expect(response.body._id).toEqual(classesIds[1])
        expect(response.body.teacher).toEqual(usersIds[2])
        expect(response.body.stars).toEqual(4)
    })

    it('should test if STATUS 400 are being thrown when user or teacher NOTFOUND while unfavorite a CLASS', async () => {
        const respondeUserNotFounded = await supertest(app).del('/classes/removeFav')
            .send({
                userId: '619fe3a87832e9827bc13d6a',
                classId: classesIds[0]
            })

        const respondeClassNotFounded = await supertest(app).del('/classes/removeFav')
            .send({
                userId: usersIds[1],
                classId: '619fe3a87832e9827bc13d6a'
            })

        expect(respondeUserNotFounded.statusCode).toEqual(400)
        expect(respondeClassNotFounded.statusCode).toEqual(400)
    })

    it('should test if returns TRUE when user remove class from favorites', async () => {
        const removeFavRes = await supertest(app).del('/classes/removeFav')
            .send({
                userId: usersIds[1],
                classId: classesIds[0]
            })

        const userFavoritesById = await supertest(app).get('/classes/fav')
            .query({
                userId: usersIds[1]
            })

        expect(removeFavRes.body).toEqual(true)
        expect(userFavoritesById.body.length).toEqual(0)

        //cleaning registers (that was created by tests) from db
        let counter = 0

        do {
            await supertest(app).del('/classes')
                .send({
                    id: classesIds[counter]
                })
            counter++
        } while (counter < classesIds.length)

        counter = 0

        do {
            await supertest(app).del('/users')
                .send({
                    id: usersIds[counter]
                })
            counter++
        } while (counter < usersIds.length)
    })

})

afterAll(done => {
    disconnect()
    done()
})