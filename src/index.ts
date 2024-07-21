import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';

import express, { Application, Request, Response } from 'express';
import localRoutes from './routes/authRoutes.js';
import googleRoutes from './routes/googleRoutes.js'
import userRoutes from './routes/userRoutes.js'
const app: Application = express();
const PORT: string | undefined = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module
const __dirname = path.dirname(__filename);

// Set EJS as the view engine and specify the path to the views directory
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '../views')); // Adjust path to point to the views directory
app.use(express.json());

app.use((req: Request, res: Response, next: any) => {
    if (req.path === '/') {
        res.redirect('/auth');
    } else {
        next();
    }
}); 

app.use('/auth', localRoutes);
app.use('/auth-google',googleRoutes);
app.use('/usr',userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
