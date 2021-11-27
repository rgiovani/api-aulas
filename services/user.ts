import { connect, isIdValid } from '../utils/mongodb'
import { verifyFields } from '../utils/validate'
import { UserModel } from '../models/user'
import { IUser } from '../types/IUser'

const findAll = async () => {
    await connect()
    return await UserModel.find()
}

const findAllNonTeachers = async () => {
    await connect()
    return await UserModel.find({ teacher: false })
}

const create = async (user: IUser) => {
    await connect()
    verifyFields(user, ['name', 'surname', 'teacher'])

    const userFounded = await UserModel.findOne({ name: user.name, surname: user.surname })

    if (userFounded) {
        throw new Error('O usuário já existe no sistema')
    }

    return (await UserModel.create(user))._id
}

const removeById = async (id: string) => {
    await connect()

    verifyFields(id, ['id'])

    const verifyId = await isIdValid(id)

    if (!verifyId)
        throw new Error('O ID não é válido')

    const userRemoved = await UserModel.findByIdAndRemove(id)
    if (!userRemoved) {
        throw new Error(`Nenhum usuario encontrado com o id: ${id}`)
    }

    return true
}

const update = async (user: IUser) => {

    verifyFields(user, ['_id', 'name', 'surname', 'teacher'])

    const verifyId = await isIdValid(user._id)

    if (!verifyId)
        throw new Error('O ID não é válido')

    await connect()

    const userUpdated = await UserModel.findOneAndUpdate({ _id: user._id }, user)

    if (!userUpdated) {
        throw new Error(`Nenhum usuario encontrado com o id: ${user._id}`)
    }

    return true
}

const becomeTeacher = async (userId: string) => {
    const verifyId = await isIdValid(userId)

    if (!verifyId)
        throw new Error('O ID não é válido, informe outro ID')

    await connect()

    const user = await UserModel.findOne({ _id: userId })

    if (!user) {
        throw new Error(`Nenhum usuario encontrado com o id: ${userId}`)
    }

    if (user.teacher) {
        throw new Error(`O usuario com o id: ${userId} ja e um professor`)
    }

    user.teacher = true

    await UserModel.findOneAndUpdate({ _id: userId }, user)

    return true
}

export {
    findAll,
    create,
    removeById,
    update,
    becomeTeacher,
    findAllNonTeachers
}