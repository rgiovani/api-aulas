import mongoose, { Schema } from 'mongoose'

const classSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    stars: {
        type: Number,
        require: true
    }
})

const ClassModel = mongoose.model('class', classSchema)

export { ClassModel }