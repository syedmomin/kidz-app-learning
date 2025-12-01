import { Response } from "express";

export const ok = (res: Response, data: unknown) => res.status(200).json({ success: true, ...data as any});
export const created = (res: Response, data: unknown) => res.status(201).json({ success: true, ...data  as any});
export const bad = (res: Response, status = 400, message = "Bad Request") => res.status(status).json({ success: false, message });
export const fail = (res: Response, status = 500, message = "Internal Server Error") => res.status(status).json({ success: false, message });
