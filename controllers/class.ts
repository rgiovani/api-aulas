import { Request, Response } from 'express'

import * as classService from '../services/class'
import { handleRoute } from '../utils/handleRoutes'

const getAll = async (req: Request<any>, res: Response<any>) => {
    return handleRoute(req, res, classService.findAll, req.query)
}

const getAllAndOrderByStars = async (req: Request<any>, res: Response<any>) => {
    return handleRoute(req, res, classService.findAndOrderByStars, req.query)
}

const getById = async (req: Request<any>, res: Response<any>) => {
    return handleRoute(req, res, classService.findById, req.query.id)
}

const getClassWithMoreStars = async (req: Request<any>, res: Response<any>) => {
    return handleRoute(req, res, classService.findOneWithMoreStars)
}

const getClassByTeacherId = async (req: Request<any>, res: Response<any>) => {
    return handleRoute(req, res, classService.findClassByTeacherId, req.query.id)
}

const getFavoriteClassesByUserId = async (req: Request<any>, res: Response<any>) => {
    return handleRoute(req, res, classService.findFavoriteClassesByUserId, req.query.userId)
}

const create = async (req: Request<any>, res: Response<any>) => {
    return handleRoute(req, res, classService.create, req.body)
}

const update = async (req: Request<any>, res: Response<any>) => {
    return handleRoute(req, res, classService.update, req.body)
}

const deleteById = async (req: Request<any>, res: Response<any>) => {
    return handleRoute(req, res, classService.removeById, req.body.id)
}

const setUserFavoriteClass = (req: Request<any>, res: Response<any>) => {
    const { userId, classId } = req.body
    return handleRoute(req, res, classService.setUserFavoriteClass, userId, classId)
}

const removeUserFavoriteClass = (req: Request<any>, res: Response<any>) => {
    const { userId, classId } = req.body
    return handleRoute(req, res, classService.removeUserFavoriteClass, userId, classId)
}

const increaseStar = (req: Request<any>, res: Response<any>) => {
    const { classId, userId, amount } = req.body
    return handleRoute(req, res, classService.increaseStar, classId, userId, amount)
}

export {
    getAll,
    getById,
    getClassWithMoreStars,
    getAllAndOrderByStars,
    getClassByTeacherId,
    getFavoriteClassesByUserId,
    create,
    deleteById,
    update,
    setUserFavoriteClass,
    removeUserFavoriteClass,
    increaseStar
}