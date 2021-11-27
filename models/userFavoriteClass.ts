import mongoose, { Schema } from 'mongoose'

const userFavoriteClassesSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    classId: {
        type: Schema.Types.ObjectId,
        ref: 'classes',
        require: true
    },
}, { timestamps: true })

const UserFavoriteClassModel = mongoose.model('userFavoriteClasses', userFavoriteClassesSchema)

export { UserFavoriteClassModel }