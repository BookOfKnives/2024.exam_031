import userDb from "./connection.js";

async function addUser(name, email, hashedPassword){
    // console.log("030 adduser.js db says, this is the new user:", name, email, hashedPassword);
    userDb.users.insertOne({ name, hashedPassword, email });
}

export default addUser;