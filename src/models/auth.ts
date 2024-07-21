import { use } from 'passport';
import { users } from './database.js'
import bcrypt from 'bcrypt';

async function signin(email : string ,password : string){
    const user = await users.findOne({email});
    if(user && await bcrypt.compare(password,user.password)){
        return { username: user.username , userid: user.userid , message: "Success"};
    }
    else{
        return {message: "invalid username or password"};
    }
}

export { signin };