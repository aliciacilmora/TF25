import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Answers are required" },
        { status: 400 }
      );
    }

    // Check if survey exists and is active
    const survey = await prisma.survey.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!survey) {
      return NextResponse.json(
        { error: "Survey not found" },
        { status: 404 }
      );
    }

    if (survey.status !== "active") {
      return NextResponse.json(
        { error: "Survey is not active" },
        { status: 400 }
      );
    }

    // Create response
    const response = await prisma.response.create({
      data: {
        surveyId: params.id,
        answers: JSON.stringify(answers),
      },
    });

    return NextResponse.json({
      success: true,
      responseId: response.id,
      message: "Response submitted successfully",
    });

  } catch (error) {
    console.error("Error submitting response:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
