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
    },
    usersWhoVoted: {
        type: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'user'
                },
                stars: {
                    type: Number,
                    require: true
                },
            }
        ],
        default: []
    }
}, { timestamps: true })

classSchema.index(
    {
        title: 'text'
    },
)

const ClassModel = mongoose.model('classes', classSchema)

export { ClassModel }