import { MongoClient } from "mongodb";

const dbUrl = process.env.DATABASEURL || "mongodb://localhost:27017";
const mongoClient = new MongoClient(dbUrl);
const dbName = process.env.DBNAME || "AuthDb";

let conn;

try {
    conn = await mongoClient.connect();
} catch(err) {
    console.log("mongodb databaseconnection error:", err)
}
const db = conn.db(dbName);

export default {
    users: db.collection("users")
}