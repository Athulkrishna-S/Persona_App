import dotenv from 'dotenv';
dotenv.config();
import path from 'path';

import express, { Application, Request, Response } from 'express';
import authRoutes from './routes/authRoutes.js';

const app: Application = express();
const PORT: string | undefined = process.env.PORT;

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

app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
