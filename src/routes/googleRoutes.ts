import dotenv from 'dotenv';
dotenv.config();

import express , {Application , Request , Response , Router} from 'express';
import passport from "passport";
import { v4 as uuidv4 } from 'uuid';
import { Strategy as GoogleStrategy , VerifyCallback} from 'passport-google-oauth20';
import { users } from '../models/database.js';
const router : Router = express.Router();
import session from 'express-session';

router.use(session({
    secret: 'your_secret_key', // Replace with your own secret
    resave: true,
    saveUninitialized: true
  }));

  
router.use(passport.initialize());
//router.use(passport.session());
  
interface User { 
    userid: string,
    username: string,
    email: string,
    category:string;
}

/* 
  "email": "finsavvy@outlook.com",
  "password": "$2b$10$fve8vi2gnLOmdJYI5hUAlucbCZrlcRvfs4KlJd3aR1GG7.7Bh08/i",
  "category": "organisation",
  "userid": "87b06465-7830-4d54-a184-e526380827a4",
  "username": "Finsavvy"
*/

async function addUser(profile:any) {
    const newuser : User ={
        userid: uuidv4(),
        username: profile.displayName,
        email: profile._json.email,
        category: "individual"
    };
    const result = await users.insertOne(newuser);
    if (result.acknowledged) {
        console.log('Insert was successful');
        return {message:"success",user:newuser};
    } else {
        console.log('Insert was not acknowledged');
        return {message:"unsuccessful",user:null};
    }
}


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: '/auth-google/google/callback'
}, async function  verify(accessToken: string, refreshToken: string, profile: any, cb: VerifyCallback): Promise<void> {
    // verification logic here
    console.log("Profile ",typeof(profile))
   /* const user :User  = {
        id : profile.id,
        displayName : profile.displayName,
        email : profile._json.email
    };
    */
    let user:any = await users.findOne({ email: profile._json.email });
    if (user) {
        return cb(null, user);
    } else {
        // Handle user not found logic here
        user = await addUser(profile);
        if(user.message === "success"){
                 return cb(null, user.user);
        }
        else{
            return cb(null, undefined);
        }
    }

}));


/*
passport.serializeUser((user: Express.User, done) => {
    done(null, user);
  });
  
//passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
  });

  */
router.get('/google', passport.authenticate('google',{scope : ['profile','email']}));
router.get('/google/callback',passport.authenticate('google',{session : false,failureRedirect : '/'}),
// success route
(req : Request , res :Response) => {
    const user : User = req.user as User; 
   // console.log("username = ",user.username);
   // console.log("userid = ",user.userid);
    res.redirect(`/auth/success?username=${user.username}&userid=${user.userid}&method=google`);
});







export default router;