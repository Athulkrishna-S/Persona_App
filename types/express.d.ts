import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            mode?: string; // Add the mode property
        }
    }
}
