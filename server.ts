import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

import classRoutes from './routes/class'
import userRoutes from './routes/user'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

classRoutes(app)
userRoutes(app)

export {
    app
}