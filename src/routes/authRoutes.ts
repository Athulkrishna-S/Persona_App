import express , {Application , Request , Response , Router} from 'express';
import { getTopics  } from '../models/usermodel.js';
import { signin } from '../models/auth.js';
import { ObjectId } from 'mongodb';
const router : Router = express.Router();

router.get('/',(req : Request , res : Response) => {
    res.sendFile('login.html', { root: 'public' });
});


interface CustomObject {
    message: string;
    userid?: string;
    username?: string;
}

/*
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

*/


router.post('/', async (req : Request , res : Response)=>{
    const { email  , password } = req.body;
    
    const obj : CustomObject = await signin(email,password);
    if (obj.message === "invalid username or password"){
        res.json({message:"invalid username or password"});
    }
    else
    {
        res.json({ username:obj.username , userid : obj.userid , message : obj.message});
    }
    
});
// Serve the HTML page
interface TopicData {
    _id: ObjectId,
    userid: string,
    topic: string,
    links: string[],
    notes: string
}

router.get('/success', async (req: Request, res: Response) => {
    const name: string = req.query.username as string;
    const userid: string = req.query.userid as string;
    const method: string = req.query.method as string;
    const data: Array<TopicData> = await getTopics(userid);
   // console.log("data in routes ", data);
    const topics: Array<{ topic: string, links: string[] }> = data.map(({ topic, links }) => ({ topic, links }));
    res.render('index', { topics, name , method , userid });
});


router.get('/success/google', async (req : Request , res : Response) => {
    const name : string = req.query.user as string;
   var topics = [
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
    res.render('index', { topics , name });
});



export default router;