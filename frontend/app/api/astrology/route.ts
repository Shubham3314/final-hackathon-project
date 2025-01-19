import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Forward the request to the backend API
    const response = await fetch(
      "https://beneficial-generosity-production.up.railway.app/api/python/generate-kundali",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const astrologyData = await response.json();

    // Return the response from the backend API
    return NextResponse.json(
      { message: "Astrology data successfully fetched", ...astrologyData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
