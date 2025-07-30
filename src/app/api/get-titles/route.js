import dbConnect from "@/lib/db";
import PostTitle from "@/models/PostTitle";

export async function GET() {
  try {
    await dbConnect();
    const titles = await PostTitle.find({}).sort({ createdAt: -1 });
    return Response.json({ titles }, { status: 200 });
  } catch (err) {
    console.error("Error fetching titles:", err);
    return Response.json({ error: "Failed to fetch titles" }, { status: 500 });
  }
}