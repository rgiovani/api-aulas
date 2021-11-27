import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    surname: {
        type: String,
        require: true
    },
    about: {
        type: String,
        require: true
    },
    teacher: {
        type: Boolean,
        require: true
    }
}, { timestamps: true })

const UserModel = mongoose.model('users', userSchema)

export { UserModel }