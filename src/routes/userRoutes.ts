import express , {Application , Request , Response , Router} from 'express';
import { getTopics ,addNote, addTopic, addLink } from '../models/usermodel.js';
import { ObjectId } from 'mongodb';
const router : Router = express.Router();


interface TopicData {
    _id: ObjectId,
    userid: string,
    topic: string,
    links: string[],
    notes: string
}

router.get('/notes',async (req : Request , res : Response) => {
    const userid: string = req.query.userid as string;
    const data: Array<TopicData> = await getTopics(userid);
    const topics: Array<{ topic: string, notes: string }> = data.map(({ topic, notes }) => ({ topic, notes }));
    res.render('notes', { topics });
});

router.post('/update/notes', async (req: Request, res: Response) => {
    const { userid, topic, note } = req.body;
    const data: boolean = await addNote(userid, topic, note);
    if (!data) {
        return res.json({ "message": "Success" });
    } else {
        return res.json({ "message": "Failed" });
    }
});

router.post('/addtopic', async (req: Request, res: Response) => {
    const { userid, topic } = req.body;
    const data: boolean = await addTopic(userid, topic);
    if (data) {
        return res.json({ "message": "Success" });
    } else {
        return res.json({ "message": "Failed" });
    }
});

router.post('/addlink',async (req : Request , res : Response) => {
    const {userid,topic,link} = req.body;
    const data: boolean = await addLink(userid,topic,link);
 //   console.log("data in add link",data);
    if (!data) {
        return res.json({ "message": "Success" });
    } else {
        return res.json({ "message": "Failed" });
    }
    
});

export default router;