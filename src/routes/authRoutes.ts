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
    callbackURL: '/auth/google/callback'
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
    res.redirect(`/auth/success?user=${user.displayName}`);
});



const topics = [
    {
        topic: "Medical",
        links: ["https://arxiv.org/abs/2407.00978", "https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=Diffusion+model+with+RAG&oq="]
    },
    {
        topic: "Poilce Sketch",
        links: ["https://www.vice.com/en/article/qjk745/ai-police-sketches", "https://www.google.com/search?q=+police+sketches+dataset&sca_esv=3a435d22dd23e419&rlz=1C1VDKB_enIN1005IN1005&sxsrf=ADLYWIKrXc2k4Q2q6hEmD2PtS8_sGVluRQ%3A1721216967883&ei=x6-XZpTONcSb4-EP4_eFsAg&ved=0ahUKEwjUzc7vgK6HAxXEzTgGHeN7AYYQ4dUDCA8&uact=5&oq=+police+sketches+dataset&gs_lp=Egxnd3Mtd2l6LXNlcnAiGCBwb2xpY2Ugc2tldGNoZXMgZGF0YXNldDIHECEYoAEYCjIHECEYoAEYCkifN1CIFVj0NHACeAGQAQCYAaIGoAGHGKoBCTAuNC43LjYtMbgBA8gBAPgBAZgCC6AC0BPCAgoQABiwAxjWBBhHwgIEECEYCsICChAAGIAEGEMYigXCAgYQABgHGB7CAgsQABiABBiRAhiKBcICBRAAGIAEwgIKEAAYgAQYFBiHAsICBhAAGBYYHsICCxAAGIAEGIYDGIoFwgIIEAAYgAQYogTCAgcQABiABBgNmAMAiAYBkAYHkgcJMi4yLjYuNi0xoAfuQg&sclient=gws-wiz-serp"]
    },
    {
        topic: "Emergency",
        links: ["https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9576386/"]
    }
];

// Set EJS as the template engine

// Serve the HTML page
router.get('/success', (req : Request , res : Response) => {
    const name : string = req.query.user as string;
    res.render('index', { topics , name });
});

router.get('/',(req : Request , res : Response) => {
    res.sendFile('login.html', { root: 'public' });
});

export default router;