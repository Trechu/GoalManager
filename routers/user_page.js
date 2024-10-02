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
        
        const db = client.db(process.env.DBNAME);
        const collection = db.collection(process.env.PROJECTCOLLECTION);
        
        if(!ObjectId.isValid(request.params.postId)){
            response.redirect('/');
            return;
        }; 

        const document = await collection.findOne({ _id: new ObjectId(request.params.postId) });
        await client.close();
        if(document == undefined){
            response.redirect('/');
            return;
        }
        if (document.members.includes(request.user.username)){
            return next()
        }
    }
    response.redirect('/');
}

async function findUsersProjects(username) {
    const projects = [];
    const client = new MongoClient(process.env.LINK);
    await client.connect();

    const db = client.db(process.env.DBNAME);
    const collection = db.collection(process.env.PROJECTCOLLECTION);

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

    const db = client.db(process.env.DBNAME);
    const collection = db.collection(process.env.PROJECTCOLLECTION);

    const document = await collection.findOne({ _id: new ObjectId(project_id) });
    await client.close();
    return document;
}

async function getNotifications(username){
    const client = new MongoClient(process.env.LINK);
    await client.connect();

    const db = client.db(process.env.DBNAME);
    const collection = db.collection(process.env.USERCOLLECTION);

    const document = await collection.findOne({ username: username });
    await client.close();
    return document["notifications"];
}

function hasNewNotifications(notif_array){
    for(let notif of notif_array){
        if(!(notif.read)){
            return true;
        }
    }
    return false;
}

router.get('/user', checkAuthenticated, async (request, response) => {
    response.render("user.ejs", { projects: await findUsersProjects(request.user.username), username: request.user.username, hasNotification: hasNewNotifications(await getNotifications(request.user.username))});
})

router.get('/user/:postId', checkValidUser, async (request, response) => {
    response.render("post.ejs", {project: await findProject(request.params.postId), hasNotification: hasNewNotifications(await getNotifications(request.user.username))});
})

router.get('/user/panel/notifications', checkAuthenticated, async (request, response) => {
    let notif_array = await getNotifications(request.user.username);
    response.render("notifications.ejs", {notifications: notif_array, hasNotification: hasNewNotifications(notif_array)});
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
    
            const db = client.db(process.env.DBNAME);
            const collection = db.collection(process.env.PROJECTCOLLECTION);
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
            const collection = db.collection(process.env.PROJECTCOLLECTION);
            const document = await collection.findOne({ _id: new ObjectId(requestBody.project_id) });
            var new_goals = document.goals;
            for(let goal of new_goals){
                if(goal["goal name"] == requestBody.goal_name){
                    goal["steps"].push(step);
                }
            }
            await collection.updateOne({ _id: new ObjectId(requestBody.project_id) }, {$set: {goals: new_goals}});
        } catch (err) {
            console.error(err);
        } finally {
            await client.close();
            response.send();
        }
    })
})

router.post('/user/create/goal', async (request, response) => {
    request.on('data', async function (data) {
        const client = new MongoClient(process.env.LINK);
        try {
            await client.connect();
            var requestBody = JSON.parse(data.toString('utf8'));
            const goal = {};
            goal["goal name"] = requestBody.goal_name;
            goal["steps"] = [];

            const db = client.db(process.env.DBNAME);
            const collection = db.collection(process.env.PROJECTCOLLECTION);
            const document = await collection.findOne({ _id: new ObjectId(requestBody.project_id) });
            var new_goals = document.goals;
            new_goals.push(goal);
            await collection.updateOne({ _id: new ObjectId(requestBody.project_id) }, {$set: {goals: new_goals}});
        } catch (err) {
            console.error(err);
        } finally {
            await client.close();
            response.send();
        }
    })
})

router.post('/user/add/member', async (request, response) => {
    request.on('data', async function (data) {
        const client = new MongoClient(process.env.LINK);
        try {
            var requestBody = JSON.parse(data.toString('utf8'));
            
            await client.connect();
            const db = client.db(process.env.DBNAME);
            const collection = db.collection(process.env.USERCOLLECTION);
            const document = await collection.findOne({ username: requestBody.member_name });
            
            if(document==undefined){
                response.send('User not found');
                await client.close();
                return;
            }
            
            const notif = {};
            const date = new Date();
            notif["notif_id"] = new ObjectId();
            notif["description"] = "You have been invited to join " + requestBody.project_name;
            notif["date"] = (new Date()).toLocaleDateString() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
            notif["read"] = false;
            notif["project id"] = requestBody.project_id; 

            var new_notifs = document.notifications;
            new_notifs.push(notif);
            await collection.updateOne({ username: requestBody.member_name }, {$set: {notifications: new_notifs}});
            await client.close();
            response.send('OK');
        } catch (err) {
            console.error(err);
        }
    })
})

export default router;