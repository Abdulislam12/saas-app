// app/api/reset-password/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendEmail } from '@/lib/sendEmail';
import { resetPasswordTemplate } from '@/lib/resetPasswordTemplate';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({
        status: 400,
        message: 'Email is required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({
        status: 404,
        message: 'Email not found',
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        resetPasswordToken: token,
        resetPasswordTokenExpiry: expires,
      },
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const subject = 'Reset Your Password';
    const html = resetPasswordTemplate(resetLink);

    await sendEmail(user.email, subject, html);

    return NextResponse.json({
      status: 200,
      message: 'Reset link sent to your email',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
