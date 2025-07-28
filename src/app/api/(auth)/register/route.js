import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(request) {
    try {
        const body = await request.json()

        // Only allow email and password — reject extra fields
        const allowedFields = ['email', 'password']
        const extraFields = Object.keys(body).filter(key => !allowedFields.includes(key))
        if (extraFields.length > 0) {
            return NextResponse.json({
                status: 400,
                message: `Unexpected fields: ${extraFields.join(', ')}`,
            })
        }

        let { email, password } = body

        // Trim and normalize email to lowercase
        email = email?.trim().toLowerCase()

        // Check required fields
        if (!email || !password) {
            return NextResponse.json({
                status: 400,
                message: 'Email and password are required',
            })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                status: 400,
                message: 'Invalid email format',
            })
        }

        // Validate password strength (min 8 characters)
        if (password.length < 8) {
            return NextResponse.json({
                status: 400,
                message: 'Password must be at least 8 characters long',
            })
        }

        // Check for existing user
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({
                status: 409,
                message: 'Email already taken',
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        })

        const { password: _ ,...userData} = newUser

        return NextResponse.json({
            status: 201,
            message: 'User registered successfully',
            userData
        })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json({
            status: 500,
            message: error.message,
        })
    }
}
