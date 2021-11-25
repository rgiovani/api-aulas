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

app.get('/class', classes.getAll)

export {
    app
}