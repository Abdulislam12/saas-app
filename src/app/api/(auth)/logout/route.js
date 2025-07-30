import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET // make sure this is defined in .env

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token =  cookieStore.get('token')?.value

    if (token) {
      // Decode the token to get the user ID
      const decoded = verify(token, JWT_SECRET);
      const userId = decoded.userId;
      console.log("userId :", userId);

      // Remove the token from DB (set it to null)
      await prisma.user.update({
        where: { id: userId },
        data: { token: null },
      })
    }

    const response = NextResponse.json({
      status: 200,
      message: 'Logout successful',
    })

    // Clear the cookie
    response.cookies.set({
      name: 'token',
      value: '',
      path: '/',
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({
      status: 500,
      message: error.message,
    })
  }
}
