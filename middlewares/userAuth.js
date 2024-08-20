import bcrypt from 'bcrypt';
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const authUser = async (username, password, done) => {
    const client = new MongoClient(process.env.LINK);
    try {
        await client.connect();

        // Change accordingly to db structure
        const db = client.db(process.env.DBNAME);
        const collection = db.collection('user');
        
        const query = {username: username};
        const entry = await collection.findOne(query);
        if(entry != null){
            bcrypt.compare(password, entry.password, (err, result) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return;
                }
                if (result) {
                    console.log('Login successfull');
                    return done(null, {username: entry.username});
                } else {
                    console.log('Login unsuccessfull');
                    return done(null, false);
                }
            });
        } else {
            console.log('Login unsuccessfull');
            return done(null,false);
        }
    } catch(err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

export default authUser;