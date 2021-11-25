import { ClassModel } from '../models/class'
import { connect } from '../utils/mongodb'

const findAll = async () => {
    await connect()
    return await ClassModel.find()
}

export {
    findAll
}