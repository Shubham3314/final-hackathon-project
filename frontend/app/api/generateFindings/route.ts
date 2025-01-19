import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Forward the request to the backend API
    const response = await fetch(
      "https://beneficial-generosity-production.up.railway.app/api/python/generate_findings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const generatedData = await response.json();

    // Return the response from the backend API
    return NextResponse.json(generatedData);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
