import express from 'express';

var router = express.Router();

const checkAuthenticated = (request, response, next) => {
    if (request.isAuthenticated()) {
        return next() 
    }
   response.redirect("/")
}


router.get('/user', checkAuthenticated, (request, response) => {
    response.render("user.ejs");
})

router.post("/logout", (request, response) => {
    request.logOut(function(err){
        if(err) 
            return next(err)
    })
    response.redirect("/");
})

export default router;