import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (!session.user.isApproved && session.user.role !== "admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { videoUrl } = await req.json();

        if (!videoUrl) {
            return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });
        }

        // Extract video ID
        const videoIdMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]+)/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (!videoId) {
            return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
        }

        // Fetch transcript
        let transcriptText = "";
        try {
            const transcript = await YoutubeTranscript.fetchTranscript(videoId);
            transcriptText = transcript.map((t) => t.text).join(" ");
        } catch (error) {
            console.error("Transcript error:", error);
            return NextResponse.json({ error: "Could not fetch transcript for this video. It might be disabled or unavailable." }, { status: 400 });
        }

        if (!transcriptText || transcriptText.length < 50) {
            return NextResponse.json({ error: "Transcript is too short to summarize." }, { status: 400 });
        }

        // Use Gemini to summarize
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are an expert educational content creator. I will provide you with a transcript from a YouTube video.
      Your task is to:
      1. Provide a concise summary of the main points (approx 3-4 sentences).
      2. Generate clean, well-structured study notes in Markdown format.
      3. Use headers, bullet points, and bold text for key terms.
      4. If there are any specific steps or actionable advice, list them clearly.
      5. Add a "Key Takeaways" section at the end.

      Transcript:
      ${transcriptText.substring(0, 15000)} // Capped to avoid token limits
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const notes = response.text();

        return NextResponse.json({ notes });
    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json(
            { error: "Failed to generate notes. Please check your API key and try again." },
            { status: 500 }
        );
    }
}
