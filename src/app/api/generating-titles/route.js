import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { ObjectId } from "mongodb"; // ✅ FIX

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const POST = async (req) => {
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
      { error: "An unexpected error occurred while generating titles." },
      { status: 500 }
    );
  }
};
