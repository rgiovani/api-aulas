import { Request, Response } from 'express'
import * as userService from '../services/user'

const getAll = async (req: Request<any>, res: Response<any>) => {
    try {
        const users = await userService.findAll()
        return res.json(users)
    } catch (err: any) {
        return res.status(400).json({ message: err.message })
    }
}

const create = async (req: Request<any>, res: Response<any>) => {
    try {
        const userCreated = await userService.create(req.body)
        return res.json(userCreated)
    } catch (err: any) {
        return res.status(400).json({ message: err.message })
    }
}

const update = async (req: Request<any>, res: Response<any>) => {
    try {
        const userUpdated = await userService.update(req.body)
        return res.json(userUpdated)
    } catch (err: any) {
        return res.status(400).json({ message: err.message })
    }
}

const deleteById = async (req: Request<any>, res: Response<any>) => {
    try {
        const { id } = req.body
        const userRemoved = await userService.removeById(id)
        return res.json(userRemoved)
    } catch (err: any) {
        return res.status(400).json({ message: err.message })
    }
}

export {
    getAll,
    create,
    update,
    deleteById
}