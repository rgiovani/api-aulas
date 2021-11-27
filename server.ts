import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

import * as user from './controllers/user'
import * as classes from './controllers/class'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.get('/users', user.getAll)
app.post('/users', user.create)
app.delete('/users', user.deleteById)
app.put('/users', user.update)
app.put('/becomeTeacher', user.becomeTeacher)


app.get('/classes', classes.getAll)
app.get('/classes/stars', classes.getAllAndOrderByStars)
app.get('/classes/id/', classes.getById)
app.get('/classes/mostVoted', classes.getClassWithMoreStars)
app.get('/classes/byteacher/', classes.getClassByTeacherId)
app.get('/classes/fav', classes.getFavoriteClassesByUserId)

app.post('/classes', classes.create)
app.post('/classes/fav', classes.setUserFavoriteClass)
app.post('/classes/vote', classes.increaseStar)

app.delete('/classes/removeFav', classes.removeUserFavoriteClass)
app.delete('/classes', classes.deleteById)

app.put('/classes', classes.update)

export {
    app
}