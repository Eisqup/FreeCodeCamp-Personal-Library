require('dotenv').config();

const { MongoClient } = require('mongodb');

async function main(callback) {
    const uri = process.env.uri
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const databaseName = "FreeCodeCamp"
        const collectionName = "PersonalLibrary"

        const database = client.db(databaseName).collection(collectionName)

        // Make the appropriate DB calls
        await callback(database);

    } catch (e) {
        // Catch any errors
        console.error(e);
        throw new Error('Unable to Connect to Database')
    }
}

module.exports = main;