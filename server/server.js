import express from "express";
import dotenv from "dotenv/config";
import session from "express-session";
import MongoStore from 'connect-mongo'
import passport from "passport";
import cors from "cors";
import authRouter from "./lib/authRouter.js";
import index from "./lib/index.js";
import sessionRouter from "./lib/sessionRouter.js";
import { Server } from "socket.io";
import http from "http";
// import ioHandler from "./lib/ioHandler.js";
const PORT = process.env.PORT || 8080;


const app = express();

const corsInit = { 
    origin: true,
    credentials: true 
  };
app.use(cors(corsInit));
const sessionMiddleware = session({ //1801 bruiger dette for at både app og io kan ha den
  // secret: process.env.SESSION_SECRET,
  secret: "keyboards", //secret for debuggin
  store: MongoStore.create({
    mongoUrl: "mongodb://localhost:27017",
    dbName: 'AuthDb',
  }),
  cookie: {
    sameSite: "none",
    secure: false,
    maxAge: 1000 * 60,
  },
  resave: true,
  saveUninitialized: true
});
  
app.use(express.static("../client/dist"));
app.use(sessionMiddleware);
app.use(passport.initialize()); //initliasie skal bruges fr at få sessions til at virke med åpas
app.use(passport.session()); //passport.sesion() er  en kortere form af passport.use(straegey etc)

app.use(index); //nyttig?
app.use(authRouter);
app.use("/session/", sessionRouter); //nyttig?

app.use((req, res, next) => {
  // console.log("TIME:", new Date); //giver  2024-01-24T21:10:21.692Z
  let date = new Date;
  console.log("AppTIME:", date.toTimeString().substr(0,8)); //giver mig det på dansk
  // console.log("TIME:",  Date.now()); //giver  12783962934234 epoc shit
  //jeg brækkede den her fordi jeg ikke bruger next, self! shiiiiiiiiit
  next();
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: "*",
    origin: "http://localhost:5173", //cors p connect sokcet -- mangler jeg htpp? //jep, manglede htpp:// protokol.
    methods: ["*"]
  }
});
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));

//måske hvis jeg siger wrap passport etc
// io.use(wrap(passport.initialize())); //did nothing
// io.use(wrap(passport.session()));
// io.use(wrap(passport.authenticate("json"))); //fik den til at crashe på auth io med en res.end not a function fejl

//io.use(wrap(authRouter)); //jeg prøver at sige wrap authRouter på IOen for at få req.user med //virker ikke
io.use((socket, next) => { //kan jeg asynce den for at lave fetch? //virker IKKE til at man kan lave assync io use
  let date = new Date;
  console.log("IuseTIME:", date.toTimeString().substr(0,8)); //giver mig det på dansk // men den ramnmers KUN ved ny socket connection, ikke hver gang en socket gør noget
  // console.log("030 server io use sicket, socket.handshake.auth.username:", socket.handshake.auth.$username) //den kan jo ikke taget... nej vent det byurde den kunne
  // console.log("030 server io use sicket, socket.handshake:", socket.handshake) //den kan jo ikke taget... nej vent det byurde den kunne
  
  // const userPassportName = socket.handshake.auth.$username; //for some reason it insists on taking the dollarsign with it DESPITE the ... ugh. so
  // const userPassportId = socket.handshake.auth.$userId;
  // const username = socket.request.sessions.username; //egentlig burtde jeg jo forholdew mig til passports, ikk? //duer ikke denne her
  // const username = socket.request.passport.username; //egentlig burtde jeg jo forholdew mig til passports, ikk? //duer heller ikke
  const socketTest = { 
    data: "this is the socketTest object from server 030",
    //"socket.request.session.passport": socket.request.session.passport, //undefined
    "socket.request.session": socket.request.session,
    "socket.handshake.auth": socket.handshake.auth, //'socket.handshake.auth': { '$username': 'hans' }
    
}; //egentlig burtde jeg jo forholdew mig til passports, ikk? //duer heller ikke

  // console.log("030 io use socket TEST",  socketTest);
  // console.log("030 io use socket TEST END");
  // if (!username) {
   if (!socket.handshake.auth.$username) {
    console.log("030 server io use says NO USERNAME error!")
    return next(new Error("invalid username"));
  }
  // console.log("030 server io use going to set username,", username);
  socket.usernameFromPassport = socket.handshake.auth.$username;
  socket.userIdFromPassport = socket.handshake.auth.$userId;
  next();
}); //taget fra socket io private messaging ... gad vide hvad det grø'

io.on("connection", (socket) => {
  let date = new Date;
  console.log("I_onTIME:", date.toTimeString().substr(0,8)); //giver mig det på dansk
  // console.log("030 server, new socket connected!, socket.name", socket.name); //gives nothing
  // console.log("030 server, more socket, socket.handshake.auth:", socket.handshake.auth); //gives { "$username": "hans" }
  // console.log("030 server, more socket, socket id:", socket.id); //gives a long string of some shit 120938092345_2143iuhwef
  socket.use(() => {
    let date = new Date;
    console.log("SocUTIME:", date.toTimeString().substr(0,8)); //giver mig det på dansk, //rammer hver gang hjeg hitter en event fra socketen
    socket.name = socket.handshake.auth.$username; //does this work?
    
  });

  const listOfAllSocketUsersConnected = [];
  for (let [ID, socket] of io.of("/").sockets) { //jeg prøver med id her -- og ikke soc.hands.auth.$id
    listOfAllSocketUsersConnected.push({
      // userID: socket.handshake.auth.$userId, //3001 den crasher her -- det er jo nok fordi at auth ikke findes efter at socketen har lavet hndshake
      userIdFromPassport: socket.userIdFromPassport,
      userSocketID: ID,
      username: socket.usernameFromPassport
      // username: socket?.handshake.auth.$username,
    });
  }
  socket.emit("users", listOfAllSocketUsersConnected);

  socket.onAny((event, ...args) => {
      // console.log("this is 030 server onAny event.");
      // console.log("030 iohandler event:", event);
      // console.log("030 iiohandler args:", args);
      // const socketSession = socket.request.session.passport; //det her giver det samme som cookien.
      //console.log("030 server js io socket request  session:", socketSession); //det her giver HELE req'en
      //console.log("030 io anyevent socket.auth", socket.auth); //giver undefined
      // console.log("030 io anyevent socket.handshake.auth.$username", socket.handshake.auth.$username); //gives hans
      // console.log("030 io anyevent socket.handshake.auth:", socket.handshake.auth); //gives the whole { "$username": "hans"}
      // console.log("030 io anyevent socket.request.session:", socket.request.session); //gives the cookie
      // socket.request.session.username = "this is my session username";
      // console.log("030 io anyevent socket.request.session afer adding username:", socket.request.session); //gives the cookie plus the this is my session username
      console.log("030 io anyevent END. event args", event, args, socket.handshake.auth);
  });
  socket.on("error", (err) => { //added from socket middlewares socket instances
    if (err && err.message === "unauthorized event") {
      socket.disconnect();
    }
  })
  // io.on("disconnect", (socket) => {
  //   console.log("030 server, socket disconnect")
  // }) //maybe itll work inside here? Iut doesnt work outsidde
  // //doesnt do anything
});


// app.use(ioHandler); //1801 jeg har bare smidt det herind, no idea ... //duede ikke
// ioHandler; //det her duer???? må teste

app.get("/sessionuserdata", (req, res) => {
  //const passportUser = req.passport.user //virker IKKE
  // const passportUser = req.passport // undefined
  // const passportUser = req.session.passport //  { user: { id: '6590297e9c8b878d69b9bb9c', username: 'hans' } }
  // console.log("030 server app.get /sessionuserdata getting hit, passportUser:", passportUser);
  // res.send({ data: req.session, passportUser }) //det her viser både session og passport
  res.send({ data: req.session }) //jeg prøver at få sessionene herigennem hen til svelten -- det virker
  //efter man har logged in har req.passport user 
})//man kan GODT så adgang til reqw.session her -- på trods af at req.sesion ikke er importer i denne fil. Men den er i den 
//ovenståpende fil. det er ret rart"! --1501

//app.get("/users/", (req, res) => {}) //tyilgå req.sessions her -- fra passport user


 //denne burde ikke lave noget
app.get("/getpassportid", (req, res) => {
  console.log("030 server api for getting passport info into socket");
  const passportId = data.passport.user.id //tjek lige at det her virker, ellers brug authRouter
  res.send({passportId});
})


//hav et api endpoint her der bruges af socketen til at lave login info i socketen. S¨kan man
//derfra bruge resten af login sessionen. ikke? jo da.
//skal ud og wolte. no other way. Plus meget bedre nu.
//her fetcher socketne fra apien passport sessionen. den sender data tilbage som socketen populater me
//derfra har socketen så adgang til sine data. og kan hente det andet.
//så slipper jeg også for at fatte passports irriterende pis. hold kæft jeg hader frameworks. my ass.

//der er åbenbart ingen skam i at bruge alle den slags ting. nej nej -- du bruger heller ikke dine hænder hvor du kan brug en hammer, vel? men astsaidg. 


//1801 jeg tror jeg mangler at bruge server og ikke app... ligesom anbders gør i sin 12_svelte sockets.
// app.listen(PORT, () => {console.log("030 server running on port:", PORT)})
server.listen(PORT, () => {
  let timeOfStart = new Date;
  console.log("server TIME:", timeOfStart.toTimeString().substr(0,8));
  console.log("030 server running on port:", PORT)
}); //changed from app to server for io things. hey, now it works.

//jeg fandt en skrip i bunden af en socket server thing.

//get chat to work. multiple logins, eh.
//3001 multiple logins done