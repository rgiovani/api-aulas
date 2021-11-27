import { Request, Response } from "express"

const handleRoute = async (req: Request<any>, res: Response<any>, fn: any, ...data: any) => {
    try {
        if (data)
            return res.json(await fn(...data))

        return res.json(await fn())
    } catch (err: any) {
        return res.status(400).json({ message: err.message })
    }
}

export {
    handleRoute
}