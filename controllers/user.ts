import { Request, Response } from 'express'

import * as userService from '../services/user'
import { handleRoute } from '../utils/handleRoutes'


const getAll = async (req: Request<any>, res: Response<any>) => {
    return handleRoute(req, res, userService.findAll)
}

const getAllNonTeachers = async (req: Request<any>, res: Response<any>) => {
    return handleRoute(req, res, userService.findAllNonTeachers)
}

const create = async (req: Request<any>, res: Response<any>) => {
    return handleRoute(req, res, userService.create, req.body)
}

const update = async (req: Request<any>, res: Response<any>) => {
    return handleRoute(req, res, userService.update, req.body)
}

const deleteById = async (req: Request<any>, res: Response<any>) => {
    return handleRoute(req, res, userService.removeById, req.body.id)
}

const becomeTeacher = async (req: Request<any>, res: Response<any>) => {
    return handleRoute(req, res, userService.becomeTeacher, req.body.userId)
}

export {
    getAll,
    getAllNonTeachers,
    create,
    update,
    deleteById,
    becomeTeacher
}