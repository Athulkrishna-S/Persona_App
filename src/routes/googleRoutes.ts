import dotenv from 'dotenv';
dotenv.config();

import express , {Application , Request , Response , Router} from 'express';
import passport from "passport";
import { Strategy as GoogleStrategy , VerifyCallback} from 'passport-google-oauth20';
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
    id: string,
    displayName: string,
    emails: string[];
}




passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: '/auth-google/google/callback'
}, function verify(accessToken: string, refreshToken: string, profile: any, cb: VerifyCallback): void {
    // verification logic here
    console.log("Profile ",profile)
    const user :User  = {
        id : profile.id,
        displayName : profile.displayName,
        emails : profile.emails
    };



    return cb(null , user);
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
    console.log("Display Name ",user.displayName);
    console.log("Emails ",user.emails);
    res.redirect(`/auth/success/google?user=${user.displayName}`);
});







export default router;