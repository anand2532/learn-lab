import { NextResponse } from "next/server";

export async function GET() {
  // API contract: Returns short tips about sign-in benefits
  const tips = [
    "Save your learning progress and track your journey",
    "Access personalized study recommendations",
    "Sync your data across all your devices",
    "Join study groups and collaborate with others",
    "Get AI-powered insights on your learning patterns",
  ];

  // Return a random tip or all tips
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return NextResponse.json({
    tip: randomTip,
    allTips: tips,
    timestamp: new Date().toISOString(),
  });
}

