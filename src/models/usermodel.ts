import { groups } from './database.js'
import { PushOperator, Document } from 'mongodb'; // Added: Import the necessary types

interface doc {
    userid: string,
    topic: string,
    links: string[],
    notes: string
}

async function getTopics(userid: string): Promise<any> {
    const data = await groups.find({ userid: userid }).toArray();
    return data;
}

async function addTopic(userid: string,topic: string) {
    const data : doc = {userid : userid,topic : topic , links : [], notes : ""};
    await groups.insertOne(data);
}

async function addLink(userid: string, topic: string, link: string) {
    await groups.updateOne(
        { userid: userid, topic: topic },
        { $push: { links: link } } as unknown as PushOperator<Document>,// Corrected: directly pushing the link instead of wrapping it in an array
    );
}

export { getTopics , addTopic }