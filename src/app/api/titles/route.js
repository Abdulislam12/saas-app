import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { ObjectId } from "mongodb"; // ✅ FIX

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  let userId = null;
  if (token) {
    const decoded = verify(token, process.env.JWT_SECRET);
    userId = decoded.userId || decoded.id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token." }, { status: 401 });
    }
  } else {
    return NextResponse.json({ error: "No token provided." }, { status: 401 });
  }

  const formData = await req.formData();
  const services = formData.get("services");
  const summary = formData.get("summary");

  if (!services || !summary) {
    return NextResponse.json(
      { error: "Missing 'services' or 'summary' field." },
      { status: 400 }
    );
  }

  const prompt = `
You are a LinkedIn personal branding expert.

Here is the information from a company's LinkedIn profile:
- Services: ${services}
- Summary: ${summary}

Based on this, generate 5 engaging and professional LinkedIn post titles that this company could post to attract attention and engagement.

Return only a numbered list of 5 post titles, and nothing else.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional LinkedIn branding expert.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const rawText = completion.choices[0].message.content;

    const postTitles = rawText
      .split("\n")
      .filter((line) => /^\d+\.\s+/.test(line))
      .map((line) => ({
        title: line.replace(/^\d+\.\s*/, "").replace(/^"|"$/g, ""),
      }));

    const objectIdUser = new ObjectId(userId); // ✅ CONVERT HERE

    await Promise.all(
      postTitles.map((post) =>
        prisma.title.create({
          data: {
            title: post.title,
            userId: objectIdUser,
          },
        })
      )
    );

    return NextResponse.json({ titles: postTitles }, { status: 200 });
  } catch (error) {
    console.error("OpenAI Error:", error);
    if (error.status === 429) {
      return NextResponse.json(
        {
          error:
            "You’ve exceeded the OpenAI rate limit. Please wait or upgrade your plan.",
        },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
};

export async function GET() {
  try {
    const cookieStore = await cookies(); // ✅ Await cookies
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. No token provided." }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
    }

    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return NextResponse.json({ error: "Token does not contain user information." }, { status: 400 });
    }

    const articles = await prisma.title.findMany({
      where: { userId },
    });

    return NextResponse.json({ articles }, { status: 200 });

  } catch (error) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching articles." },
      { status: 500 }
    );
  }
};
