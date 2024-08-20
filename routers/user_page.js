import express from 'express';

var router = express.Router();

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next() 
    }
   res.redirect("/")
}


router.get('/user', checkAuthenticated, (request, response) => {
    response.send('Hello ' + request.user.username + " !");
})

export default router;