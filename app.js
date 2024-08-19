import express from 'express'
import passport from 'passport'
import session from 'express-session'
import { Strategy as LocalStrategy } from 'passport-local'
import authUser from './authenticaton/userAuth.js'

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

authUser("Jane", "Doe");

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