import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // For now, this is a placeholder API that returns simple responses
    // You can replace this with your actual AI/LLM integration later
    
    // Simple response logic based on common interview questions
    const responses = [
      "That's interesting! Can you tell me more about that?",
      "Thank you for sharing that with me. How did that make you feel?",
      "That's a great example. What would you do differently if you faced that situation again?",
      "I appreciate your honesty. What did you learn from that experience?",
      "That sounds challenging. How did you overcome those difficulties?",
      "Very insightful! Can you give me another example of when you demonstrated that skill?",
      "Thank you for that detailed response. What would you say are your biggest strengths?",
      "That's impressive! How do you handle stress and pressure?",
      "Great answer! What motivates you the most in your work?",
      "Excellent! Do you have any questions for me about this role?"
    ];

    // Simple keyword-based response selection
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    if (message.toLowerCase().includes("strength") || message.toLowerCase().includes("strong")) {
      response = "That's a great strength to have! Can you give me a specific example of when you've used this strength successfully?";
    } else if (message.toLowerCase().includes("weakness") || message.toLowerCase().includes("improve")) {
      response = "It's good that you're self-aware about areas for improvement. What steps are you taking to work on this?";
    } else if (message.toLowerCase().includes("experience") || message.toLowerCase().includes("worked")) {
      response = "That's valuable experience! What was the most challenging part of that role?";
    } else if (message.toLowerCase().includes("goal") || message.toLowerCase().includes("future")) {
      response = "Those are excellent goals! How do you plan to achieve them?";
    } else if (message.toLowerCase().includes("team") || message.toLowerCase().includes("collaborat")) {
      response = "Teamwork is crucial! Can you describe a time when you had to resolve a conflict within your team?";
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    return NextResponse.json({
      response: response,
      conversationId: `conv_${Date.now()}`,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error processing interview chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
