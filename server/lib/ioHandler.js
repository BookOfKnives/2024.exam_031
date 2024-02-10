// import express from "express";
// // import io from "socket.io";
// import http from "http";
// import { Server } from "socket.io";

// const app = express();
// const server = http.createServer(app);

// app.use(express.static("../client/dist")); //mmåske skal dette være i server?
//bad idea trying new things : (
// const io = new Server(server, {
//     cors: {
//         origin: "*",
//         methods: ["*"]
//     }
// });

io.on("connection", socket => {
    console.log("030 iohandler server, new socket connected!");

    socket.onAny((event, ...args) => {
        console.log("this is 030 server ioHandler.js, onAny event.");
        console.log("030 iohandler event:", event);
        console.log("030 iiohandler args:", args);
        console.log("030 iiohandler END.");
    });
});

export default io;

//1801 doesn work at all