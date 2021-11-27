import * as classes from '../controllers/class'

export default function classRoutes(app: any) {
    app.get('/classes', classes.getAll)
    app.get('/classes/stars', classes.getAllAndOrderByStars)
    app.get('/classes/id/', classes.getById)
    app.get('/classes/mostVoted', classes.getClassWithMoreStars)
    app.get('/classes/byteacher/', classes.getClassByTeacherId)
    app.get('/classes/fav', classes.getFavoriteClassesByUserId)

    app.post('/classes', classes.create)
    app.post('/classes/fav', classes.setUserFavoriteClass)
    app.post('/classes/vote', classes.increaseStar)

    app.delete('/classes/removeFav', classes.removeUserFavoriteClass)
    app.delete('/classes', classes.deleteById)

    app.put('/classes', classes.update)
}