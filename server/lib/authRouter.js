import { Router, json } from "express";
import { passwordStrength } from "check-password-strength";
import bcrypt from "bcrypt";
import passport from "passport";
import JsonStrategy from "passport-json";
import db from "../database/connection.js"
import addUser from "../database/create.js"
const router = Router();

router.use(json());

function generateRandomUserId() {
  return Math.floor(Math.random() * 1000000);
}

let user; //jeg tror det er en fejl at have user her
//jeg tror en af mine fejl er at have denneher monstrøse ... authblock. Jeg kan prøve at genoprette den
//menb jeg kan osse prøve eat sende req til den næste function.
//jeg har prøvet at sætte req som med i callbacken, det duede ikke-- jeg får staidg "req not defined".

passport.use(new JsonStrategy(
  async function(username, password, done) {
  // console.log("1: 030 server auth 1");
   try {
      user = await db.users.findOne({ name: username }); //den kan ikke finde ud af ({ username })
       console.log("2: 030 server auth user found:", user);
      if (!user)  return done(null, false); 
      const isPasswordReal = await bcrypt.compare(password, user.hashedPassword)
      if (!isPasswordReal) {
        console.log("3: 030 auth says wrong pesssword!");
        return done(null, false)
      }
    }
    catch (err) {
          console.log("4: 030 auth error!");
      return done(err)
    }
  console.log("5: auth 030 user in passport:", user.name)
  //i rEALLY gotta leanr how to js debug
  //welkl that thwas easy. f5 start, step over ...
  ///user.id = generateRandomUserId();
  return done(null, user)
  }
)); 
//1401
//jeg tror jeg helt har misforstået noget. jeg tror det skal være i json'bodien HELE tiden.
//jeg tror jeg starter forfra med local. det er vist det nemmeste.
//næste skridft, brugh session til noget i frontend
//skal visty osse have ID unik per person.

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user._id, username: user.name }); //den kan ikke tilgå req... var det bare name? det var bare name.
  });
});
passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

router.post("/register", json(), async (req, res) => { 
  // console.log("030 register authRouter says, thjis is new user:", req.body)
  if ((passwordStrength(req.body.password).id) == 0 ) {
      res.status(403);
      res.send({data: "Error: password too weak."});
   }; 
  const hashedPw = await bcrypt.hash(req.body.password, 12);
  req.body.passwordHash = hashedPw;
  // const newUser = {
  //     name: req.body.username,
  //     email: req.body.email,
  //     passwordHash: hashedPw
  // };
  // const postFetchInit =  {
  //     method: "POST",
  //     credentials: "include",
  //     mode: "cors",
  //     headers: {
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Credentials": true,
  //     },
  //     body: JSON.stringify(newUser)
  // }
  // console.log("bship server lib authrouter SyntaxError? 001 name:", newUser);
  // console.log("bship server lib authrouter SyntaxError? 002 passwqore:", newUser.passwordHash);
  addUser(req.body.username, req.body.email, req.body.passwordHash); 
  res.send({data: { success: true, username: req.body.username, email: req.body.email, passwordHash: req.body.passwordHash }})
}); 

router.post("/newuserregistration", json(), async (req, res) => { //denneher bruges ikke
  addUser(req.body.name, req.body.email, req.body.passwordHash); //jeg rykker det her op i reouter.post /register
  res.send("028 bship server newuserregistration hit!");
});

router.post('/login/password', 
  passport.authenticate('json', { failureRedirect: '/' }), //on fail it goes to /login but its an SPA, it sohuldnt go anywhere -- ah... without redirect itll just go to lgoinasswortd but it STILL fails.
 // passport.authenticate('json'), //on fail it goes to /login but its an SPA, it sohuldnt go anywhere
  function(req, res) { 
    // console.log("030 auth js login/password: req.user should be populated by passport:", req.user); //her har vi navn og etc
    // console.log("030 auth js login/password: req.user should be populated by session:", req.session); //her er den tom
    res.redirect('/');
  }
);

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



export default router;