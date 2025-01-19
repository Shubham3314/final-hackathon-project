import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to securely store this key in your environment variables
});

export async function POST(request:Request) {
  try {
    const { messages } = await request.json();
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-4o-mini", // Replace with your preferred model
    });

    const assistantMessage = completion.choices[0].message.content;
    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Error in API Route:", error);
    return NextResponse.json(
      { message: "Error processing your request. Please try again." },
      { status: 500 }
    );
  }
}