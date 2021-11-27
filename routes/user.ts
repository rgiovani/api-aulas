import * as user from '../controllers/user'

export default function userRoutes(app: any) {
    app.get('/users', user.getAll)
    app.post('/users', user.create)
    app.delete('/users', user.deleteById)
    app.put('/users', user.update)
    app.put('/users/becomeTeacher', user.becomeTeacher)
}