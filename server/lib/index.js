import { Router } from "express";
const router = Router();

router.get("/welcome", (req, res, next) => {
    //next();
    console.log("Welcome");
    res.send({ message: "I am in room 1" });
});

router.get("/room", (req, res, next) => {
    res.send({ message: "I am in room 2" });
});

// router.get("/", (req, res) => { //flytter det her i server
//     res.send({ data: req.session }) //jeg prøver at få sessionene herigennem hen til svelten
// })//man kan GODT så adgang til reqw.session her -- på trods af at req.sesion ikke er importer i denne fil. Men den er i den 
// //ovenståpende fil. det er ret rart"! --1501

export default router;
