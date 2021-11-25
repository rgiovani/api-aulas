import { UserModel } from '../models/user'
import { connect } from '../utils/mongodb'
import { IUser } from '../types/IUser'

const findAll = async () => {
    await connect()
    return await UserModel.find()
}

const create = async (user: IUser) => {
    await connect()

    if (!user.name)
        throw new Error('Informe o campo name')

    if (!user.surname)
        throw new Error('Informe o campo surname')

    if (user.teacher === undefined)
        throw new Error('Informe o campo teacher')

    const userFounded = await UserModel.findOne({ name: user.name, surname: user.surname })

    if (userFounded) {
        throw new Error('O usuário já existe no sistema')
    }

    return (await UserModel.create(user))._id
}

const removeById = async (id: string) => {
    await connect()

    if (!id)
        throw new Error('Informe o campo id')

    const userRemoved = await UserModel.findByIdAndRemove(id)
    if (!userRemoved) {
        throw new Error(`Nenhum usuario encontrado com o id: ${id}`)
    }

    return true
}

const update = async (user: IUser) => {
    if (!user._id)
        throw new Error("Informe o campo _id!")

    if (!user.name)
        throw new Error('Informe o campo name')

    if (!user.surname)
        throw new Error('Informe o campo surname')

    if (user.teacher === undefined)
        throw new Error('Informe o campo teacher')

    await connect()

    const userUpdated = await UserModel.findOneAndUpdate({ _id: user._id }, user)

    if (!userUpdated) {
        throw new Error(`Nenhum usuario encontrado com o id: ${user._id}`)
    }

    return true
}

export {
    findAll,
    create,
    removeById,
    update
}