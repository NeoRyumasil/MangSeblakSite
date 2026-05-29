import { app } from '../src/index';

// Bungkus fungsi fetch agar konteks Request-nya tepat
const handler = (req: Request) => app.fetch(req);

// Ekspor ke semua metode HTTP yang didukung oleh Vercel Serverless
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;