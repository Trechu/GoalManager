import express from 'express'
import passport from 'passport'
import session from 'express-session'
import { Strategy as LocalStrategy } from 'passport-local'
import authUser from './middlewares/userAuth.js'

const app = express();
const PORT = 3001;
app.set('view engine', 'ejs');

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

const checkAuthenticated = (request, response, next) => {
    if(request.isAuthenticated()){
        return next();
    }
    response.redirect('/');
}

app.get('/', function (request, response) {
    response.render('index.ejs');
});

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is running. App is listening on port "+ PORT)
    else 
        console.log("Server was not able to start", error);
    }
);