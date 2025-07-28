import { NextResponse } from 'next/server'

export async function GET(request) {
    return NextResponse.json({
        status: 200,
        message: 'My profile',
    })
}
