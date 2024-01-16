import express from "express";
import dotenv from "dotenv/config";
import session from "express-session";
import MongoStore from 'connect-mongo'
import passport from "passport";
import cors from "cors";
import authRouter from "./lib/authRouter.js";
import index from "./lib/index.js";
import sessionRouter from "./lib/sessionRouter.js";

const PORT = process.env.PORT || 8080;

const app = express();

const corsInit = { 
    origin: true,
    credentials: true 
  };
app.use(cors(corsInit));

app.use(session({
    secret: process.env.SESSION_SECRET,
    // secret: "keyboards", //secret for debuggin
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
    }));
app.use(passport.initialize()); 
app.use(passport.session()); //passport.sesion() er  en kortere form af passport.use(straegey etc)
app.use(index);
app.use(authRouter);
app.use("/session/", sessionRouter); //nyttig?

app.get("/", (req, res) => {
  res.send({ data: req.session }) //jeg prøver at få sessionene herigennem hen til svelten
})//man kan GODT så adgang til reqw.session her -- på trods af at req.sesion ikke er importer i denne fil. Men den er i den 
//ovenståpende fil. det er ret rart"! --1501

//app.get("/users/", (req, res) => {}) //tyilgå req.sessions her -- fra passport user

app.listen(PORT, () => {console.log("030 server running on port:", PORT)})

