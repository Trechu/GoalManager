import bcrypt from 'bcrypt';
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const authUser = async (username, password, done) => {
    const client = new MongoClient(process.env.LINK);
    try {
        await client.connect();

        // Change accordingly to db structure
        const db = client.db('GOALS');
        const collection = db.collection('user');
        
        const query = {name: username};
        const entry = await collection.findOne(query);
        console.log(entry);
        bcrypt.compare(password, entry.password, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return;
            }
            if (result) {
                return done(null, entry.name);
            } else {
                return done(null, false);
            }
        });
    } catch(err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

export default authUser;