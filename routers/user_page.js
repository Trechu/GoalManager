import express, { request, response } from 'express';
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

var router = express.Router();

const checkAuthenticated = (request, response, next) => {
    if (request.isAuthenticated()) {
        return next()
    }
    response.redirect("/")
}

async function findUsersProjects(username) {
    const projects = [];
    const client = new MongoClient(process.env.LINK);
    await client.connect();

    // Change accordingly to db structure
    const db = client.db(process.env.DBNAME);
    const collection = db.collection('project');

    const cursor = await collection.find({members: username});
    while (await cursor.hasNext()) {
        projects.push(await cursor.next());
    }
    await client.close();
    return projects;
}


router.get('/user', checkAuthenticated, async (request, response) => {
    response.render("user.ejs", {projects: await findUsersProjects(request.user.username)});
})

router.post("/logout", (request, response) => {
    request.logOut(function (err) {
        if (err)
            return next(err)
    })
    response.redirect("/");
})

export default router;