import { Router } from "express";
//import session from "express-session";
//does this need session or is that implied in the import? its probably not implied

const router = Router();

router.get("/users/me", (req, res) => { 
    res.send({ data: req.session.user });
});

router.post("/register", (req, res) => {
    req.session.username = req.body.username;
    res.send({ data: req.body.username });
});



export default router;