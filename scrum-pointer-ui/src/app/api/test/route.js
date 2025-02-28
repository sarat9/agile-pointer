import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    return Response.json({ message: 'Hello World' })
}


export async function POST(req) {
    const { roomId, userName } = req.body;
    return Response.json({ success: true, roomId })
}