import { ZodSchema } from "zod/v3";
import { Request, Response, NextFunction } from 'express';

module.exports = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if(!result.success) {
        return res.status(400).json({error: result.error.issues.map(e => e.message)});
    }
    req.body = result.data;
    next()
};