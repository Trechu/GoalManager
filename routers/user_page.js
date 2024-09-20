import express, { request, response } from 'express';
import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

var router = express.Router();

const checkAuthenticated = (request, response, next) => {
    if (request.isAuthenticated()) {
        return next()
    }
    response.redirect("/")
}

const checkValidUser = async (request, response, next) => {
    if (request.isAuthenticated()) {
        const client = new MongoClient(process.env.LINK);
        await client.connect();
        
        // Change accordingly to db structure
        const db = client.db(process.env.DBNAME);
        const collection = db.collection('project');
        
        const document = await collection.findOne({ _id: new ObjectId(request.params.postId) });
        await client.close();
        if (document.members.includes(request.user.username)){
            return next()
        }
    }
    response.redirect('back');
}

async function findUsersProjects(username) {
    const projects = [];
    const client = new MongoClient(process.env.LINK);
    await client.connect();

    // Change accordingly to db structure
    const db = client.db(process.env.DBNAME);
    const collection = db.collection('project');

    const cursor = await collection.find({ members: username });
    while (await cursor.hasNext()) {
        projects.push(await cursor.next());
    }
    await client.close();
    return projects;
}

async function findProject(project_id){
    const client = new MongoClient(process.env.LINK);
    await client.connect();

    // Change accordingly to db structure
    const db = client.db(process.env.DBNAME);
    const collection = db.collection('project');

    const document = await collection.findOne({ _id: new ObjectId(project_id) });
    await client.close();
    return document;
}

router.get('/user', checkAuthenticated, async (request, response) => {
    response.render("user.ejs", { projects: await findUsersProjects(request.user.username), username: request.user.username });
})

router.get('/user/:postId', checkValidUser, async (request, response) => {
    response.render("post.ejs", {project: await findProject(request.params.postId)});
})

router.post("/logout", (request, response) => {
    request.logOut(function (err) {
        if (err)
            return next(err)
    })
    response.redirect("/");
})

router.post('/user/create', async (request, response) => {
    request.on('data', async function (data) {
        const client = new MongoClient(process.env.LINK);
        try {
            await client.connect();
            var requestBody = JSON.parse(data.toString('utf8'));
            const project = {};
            project['project name'] = requestBody.name;
            project['project description'] = requestBody.description;
            project['owner'] = requestBody.username;
            project['members'] = [requestBody.username];
            project['goals'] = [];
    
            // Change accordingly to db structure
            const db = client.db(process.env.DBNAME);
            const collection = db.collection('project');
            await collection.insertOne(project);
        } catch (err) {
            console.error(err)
        } finally {
            await client.close();
            response.send();
        }
    })
})

router.post('/user/create/step', async (request, response) => {
    request.on('data', async function (data) {
        const client = new MongoClient(process.env.LINK);
        try {
            await client.connect();
            var requestBody = JSON.parse(data.toString('utf8'));
            const step = {};
            step["step name"] = requestBody.step_name;
            step["step description"] = requestBody.step_description;
            step["status"] = requestBody.step_status;
            step["due date"] = requestBody.step_date;
            step["cost"] = requestBody.step_cost;

            const db = client.db(process.env.DBNAME);
            const collection = db.collection('project');
            const document = await collection.findOne({ _id: new ObjectId(requestBody.project_id) });
            var new_goals = document.goals;
            for(let goal of new_goals){
                if(goal["goal name"] == requestBody.goal_name){
                    goal["steps"].push(step);
                }
            }
            new_goals = JSON.parse(JSON.stringify(new_goals));
            await collection.updateOne({ _id: new ObjectId(requestBody.project_id) }, {$set: {goals: new_goals}});
        } catch (err) {
            console.error(err);
        } finally {
            await client.close();
            response.send();
        }
    })
})

export default router;