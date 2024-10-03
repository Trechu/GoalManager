import express from 'express'
import passport from 'passport'
import session from 'express-session'
import { Strategy as LocalStrategy } from 'passport-local'
import authUser from './middlewares/userAuth.js'
import path from 'path'

import RegisterRouter from './routers/register.js';
import UserRouter from './routers/user_page.js';

const app = express();
const PORT = 3001;
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(authUser));

passport.serializeUser((user, done) => {
    done(null,user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})

const checkLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { 
         return res.redirect("/user");
    }
    next();
}

app.get('/', checkLoggedIn, function (request, response) {
    response.render('index.ejs');
});

app.post('/' , passport.authenticate('local', {
    successRedirect: "/user",
    failureRedirect: "/",
}))

app.use(express.static(path.join('./scripts')));
app.use(express.static(path.join('./styles')));
app.use(RegisterRouter);
app.use(UserRouter);

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is running. App is listening on port "+ PORT)
    else 
        console.log("Server was not able to start", error);
    }
);