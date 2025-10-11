import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { questions, companyId } = body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "Questions are required" },
        { status: 400 }
      );
    }

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Generate UUID for the survey
    const surveyUuid = uuidv4();

    // Create survey in database
    const survey = await prisma.survey.create({
      data: {
        id: surveyUuid,
        userId: session.user.id,
        companyId: companyId,
        questions: JSON.stringify(questions),
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Return the UUID and survey data
    return NextResponse.json({
      uuid: surveyUuid,
      survey: {
        id: survey.id,
        questions: questions,
        status: survey.status,
        createdAt: survey.createdAt,
      },
      message: "Survey created successfully",
    });

  } catch (error) {
    console.error("Error creating survey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's surveys
    const surveys = await prisma.survey.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Parse questions for each survey
    const surveysWithParsedQuestions = surveys.map((survey: any) => ({
      ...survey,
      questions: JSON.parse(survey.questions as string),
    }));

    return NextResponse.json({
      surveys: surveysWithParsedQuestions,
    });

  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
