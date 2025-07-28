import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET_KEY'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d' // fallback to 1 day

export async function POST(request) {
  try {
    const body = await request.json()

    // Allow only email and password
    const allowedFields = ['email', 'password']
    const extraFields = Object.keys(body).filter(
      (key) => !allowedFields.includes(key)
    )
    if (extraFields.length > 0) {
      return NextResponse.json({
        status: 400,
        message: `Unexpected fields: ${extraFields.join(', ')}`,
      })
    }

    let { email, password } = body
    email = email?.trim().toLowerCase()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({
        status: 400,
        message: 'Email and password are required',
      })
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid email format',
      })
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({
        status: 401,
        message: 'Invalid email or password',
      })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({
        status: 401,
        message: 'Invalid email or password',
      })
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    // Update user with token
    await prisma.user.update({
      where: { id: user.id },
      data: { token },
    })

    // Prepare response
    const response = NextResponse.json({
      status: 200,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    })

    // Set cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      status: 500,
      message: error.message,
    })
  }
}
