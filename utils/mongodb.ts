import { connect as dbConnect, disconnect as dbDisconnect, connection, Types } from 'mongoose'

const connect = async () => {
    if (!process.env.DATABASE_URL) throw new Error('As variáveis de ambiente em .env não foram definidas')

    const isAlreadyConnected = connection.readyState === 1
    if (isAlreadyConnected) {
        return connection
    }

    const mongoConfig = {
        ignoreUndefined: true
    }

    return dbConnect(process.env.DATABASE_URL, mongoConfig)
}

const isIdValid = async (data: any) => {
    return Types.ObjectId.isValid(data?.toString())
}

const getType = async () => {
    return Types
}

const disconnect = async () => {
    await dbDisconnect()
}

export {
    connect, disconnect, isIdValid, getType
}
