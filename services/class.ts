import { connect, getType, isIdValid } from '../utils/mongodb'
import { verifyFields } from '../utils/validate'
import { ClassModel } from '../models/class'
import { UserModel } from '../models/user'
import { IClass } from '../types/IClass'
import { UserFavoriteClassModel } from '../models/userFavoriteClass'

const findAll = async (query?: any) => {
    const { order } = query
    await connect()
    let fieldToOrder = 'title'
    if (order == 'desc')
        fieldToOrder = '-title'

    return await ClassModel.find().sort(fieldToOrder)
}

const findById = async (id: string) => {
    await connect()
    verifyFields(id, ['id'])
    const classFounded = await ClassModel.findOne({ _id: id })
    if (!classFounded)
        throw new Error('Aula nao encontrada...')

    return classFounded
}

const findOneWithMoreStars = async () => {
    await connect()
    return (await ClassModel.find().sort("-stars").limit(1))[0]
}

const findAndOrderByStars = async (query?: any) => {
    await connect()

    const { order } = query
    let fieldToOrder = 'stars'
    if (order == 'desc')
        fieldToOrder = '-stars'

    return await ClassModel.find().sort(fieldToOrder)
}

const findClassByTeacherId = async (teacherId: string) => {
    await connect()
    return await ClassModel.find({ teacher: teacherId })
}

const findFavoriteClassesByUserId = async (userId: string) => {
    await connect()
    const favClasses = await UserFavoriteClassModel.find({ userId: userId })

    let classesIds: any[] = []
    favClasses.find(item => {
        classesIds.push(item.classId)
    })

    return await ClassModel.find({
        '_id': {
            $in: classesIds
        }
    })
}

const setUserFavoriteClass = async (userId: string, classId: string) => {
    await connect()

    const userFounded = await UserModel.findOne({ _id: userId })
    if (!userFounded) {
        throw new Error("Usuario nao encontrado")
    }

    const classFounded = await ClassModel.findOne({ _id: classId })
    if (!classFounded) {
        throw new Error("Aula nao encontrada")
    }

    await UserFavoriteClassModel.create({ userId, classId })

    return true
}

const removeUserFavoriteClass = async (userId: string, classId: string) => {
    await connect()

    const userFounded = await UserModel.findOne({ _id: userId })
    if (!userFounded) {
        throw new Error("Usuario nao encontrado")
    }

    const classFounded = await ClassModel.findOne({ _id: classId })
    if (!classFounded) {
        throw new Error("Aula nao encontrada")
    }

    await UserFavoriteClassModel.findOneAndRemove({ userId: userId.toString(), classId: classId.toString() })

    return true
}

const increaseStar = async (classId: string, userId: string, amount: number) => {
    await connect()
    verifyFields({ classId, userId, amount }, ['classId', 'userId', 'amount'])

    if (amount < 0 || amount > 5) {
        throw new Error('Quantidade de estrelas inválidas, valores permitidos: 0 a 5')
    }

    const userFounded = await UserModel.findOne({ _id: userId })
    if (!userFounded) {
        throw new Error("Usuario nao encontrado")
    }

    const classFounded = await ClassModel.findOne({ _id: classId })

    if (!classFounded) {
        throw new Error("Aula nao encontrada")
    }

    const userVote = classFounded.usersWhoVoted.filter((obj: any) => obj.user.toString() === userId)[0]

    if (userVote?._id.toString()) {
        classFounded.stars -= userVote.stars

        await ClassModel.findOneAndUpdate({ _id: classId }, {
            $pull: {
                usersWhoVoted: { _id: userVote?._id.toString() }
            },
        })
    }

    classFounded.stars += amount

    await ClassModel.findOneAndUpdate({ _id: classId }, {
        $set: { stars: classFounded.stars },
        $push: {
            usersWhoVoted: { user: userFounded, stars: amount }
        },
    })

    return true
}

const create = async (newClass: IClass) => {
    await connect()
    const { title, description, teacherId } = newClass

    verifyFields(newClass, ['title', 'description', 'teacherId'])

    const userFounded = await UserModel.findOne({ _id: teacherId })

    if (!userFounded.teacher)
        throw new Error('O usuario informado nao e um professor')

    return (await ClassModel.create({ title, description, teacher: teacherId, stars: 0, usersWhoVoted: [] }))._id
}

const update = async (newClass: IClass) => {
    const { _id, title, description, teacherId } = newClass

    verifyFields(newClass, ['_id', 'title', 'description', 'teacherId'])

    await connect()
    const verifyId = await isIdValid(_id)

    if (!verifyId)
        throw new Error('O ID não é válido')

    const classUpdated = await ClassModel.findOneAndUpdate({ _id: _id, teacher: teacherId }, newClass)

    if (!classUpdated) {
        throw new Error(`Nenhuma aula com o id: ${classUpdated._id} do professor: ${classUpdated.teacher} encontrada`)
    }

    return true
}

const removeById = async (id: string) => {
    await connect()
    verifyFields(id, ['id'])

    const verifyId = await isIdValid(id)

    if (!verifyId)
        throw new Error('O ID não é válido')

    const classRemoved = await ClassModel.findByIdAndRemove(id)

    if (!classRemoved)
        throw new Error(`Nenhuma aula encontrada com o id: ${id}`)

    return true
}

export {
    findAll,
    findById,
    findOneWithMoreStars,
    findAndOrderByStars,
    findClassByTeacherId,
    findFavoriteClassesByUserId,
    create,
    update,
    removeById,
    setUserFavoriteClass,
    removeUserFavoriteClass,
    increaseStar
}