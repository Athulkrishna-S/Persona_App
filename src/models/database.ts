import dotenv from 'dotenv';
dotenv.config();
import { MongoClient , Db, Collection } from "mongodb";

const uri : string = process.env.DATABASE_URI || '';

const client : MongoClient = new MongoClient(uri);
await client.connect();

const db : Db = client.db(process.env.DATABASE_NAME);

const users : Collection = db.collection('users');
const groups : Collection = db.collection('groups')
export {users , groups};