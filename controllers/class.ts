import { Request, Response } from 'express'
import * as classService from '../services/class'

const getAll = async (req: Request<any>, res: Response<any>) => {
    try {
        const classes = await classService.findAll()
        return res.json(classes)
    } catch (err: any) {
        return res.status(400).json({ message: err.message })
    }
}

export {
    getAll
}