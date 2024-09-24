import express from 'express';
import bcrypt from 'bcrypt';
const saltRounds = 10;
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

var router = express.Router();

router.get('/register', (request, response) => {
    response.render('registration.ejs');
})


router.post('/register', (request, response) => {
    request.on('data', async function (data) {
        var requestBody = JSON.parse(data.toString('utf8'));
        const client = new MongoClient(process.env.LINK);
        try {
            await client.connect();

            const db = client.db(process.env.DBNAME);
            const collection = db.collection(process.env.USERCOLLECTION);

            const query1 = { name: requestBody.username };
            const entry1 = await collection.findOne(query1);

            if (entry1 != null) {
                // Handle already existing account - username
            } else {
                const query2 = { email: requestBody.email };
                const entry2 = await collection.findOne(query2);

                if (entry2 != null) {
                    // Handle already existing account - email
                } else {
                    const hashedPassword = await bcrypt.hash(requestBody.password, saltRounds)
                    const userObject = {
                        username: requestBody.username,
                        password: hashedPassword,
                        email: requestBody.email,
                        notifications: []
                    }
                    if (userObject.password != undefined && userObject.password != null && userObject.password != "") {
                        await collection.insertOne(userObject);
                    };

                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            await client.close();
        }
    })
})

export default router;