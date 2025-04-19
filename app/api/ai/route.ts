import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { kv } from "@vercel/kv"

// Define request types
type RequestType = "insights" | "normalize-title" | "negotiation-script"

// Cache TTL in seconds (24 hours)
const CACHE_TTL = 86400

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json()

    // Validate request
    if (!type || !data) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Generate cache key based on request type and data
    const cacheKey = `llm:${type}:${JSON.stringify(data)}`

    // Check cache first
    try {
      const cachedResult = await kv.get(cacheKey)
      if (cachedResult) {
        return NextResponse.json({ result: cachedResult, source: "cache" })
      }
    } catch (error) {
      // If KV is unavailable, continue without caching
      console.error("Cache error:", error)
    }

    // Process based on request type
    let result
    switch (type as RequestType) {
      case "insights":
        result = await generateCareerInsights(data)
        break
      case "normalize-title":
        result = await normalizeJobTitle(data)
        break
      case "negotiation-script":
        result = await generateNegotiationScript(data)
        break
      default:
        return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
    }

    // Store in cache if successful
    try {
      await kv.set(cacheKey, result, { ex: CACHE_TTL })
    } catch (error) {
      // If KV is unavailable, continue without caching
      console.error("Cache error:", error)
    }

    return NextResponse.json({ result, source: "llm" })
  } catch (error) {
    console.error("LLM API error:", error)

    // Get appropriate fallback based on request type
    let fallback
    try {
      const { type } = await request.json()
      fallback = getFallbackResponse(type as RequestType)
    } catch (e) {
      fallback = getFallbackResponse("insights") // Default fallback
    }

    return NextResponse.json({ error: "Failed to process request", fallback, source: "fallback" }, { status: 500 })
  }
}

// Generate personalized career insights based on user profile
async function generateCareerInsights(data: any) {
  const { experienceLevel, jobTitle, skills, industry, salary } = data

  const prompt = `
    Generate 3-4 personalized career insights for a content marketing professional with the following profile:
    - Experience: ${experienceLevel}
    - Current role: ${jobTitle}
    - Skills: ${skills.join(", ")}
    - Industry: ${industry}
    - Current estimated salary: ${salary}

    Focus on:
    1. Career progression opportunities based on their experience and skills
    2. Skills they could develop to increase their market value
    3. Industry-specific advice for their situation
    4. Salary negotiation or advancement strategies

    Format each insight as a concise, actionable bullet point. Keep the total response under 200 words.
    Do not use generic platitudes. Be specific to their profile.
  `

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt,
    temperature: 0.7,
    maxTokens: 500,
  })

  return text
    .trim()
    .split("\n")
    .filter((line) => line.trim().length > 0)
}

// Normalize job title to standard categories
async function normalizeJobTitle(data: any) {
  const { title } = data

  const prompt = `
    Map the following content marketing job title to the most appropriate standard category from this list:
    - Content Writer
    - Content Specialist
    - Content Strategist
    - Content Manager
    - Content Lead
    - Senior Content Marketer
    - Head of Content
    - Content Director
    - VP of Content

    Job title to normalize: "${title}"

    Return only the normalized job title from the list above, nothing else.
  `

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt,
    temperature: 0.3,
    maxTokens: 50,
  })

  return text.trim()
}

// Generate salary negotiation script
async function generateNegotiationScript(data: any) {
  const { experienceLevel, jobTitle, skills, currentSalary, targetSalary, strengths } = data

  const prompt = `
    Create a personalized salary negotiation script for a content marketing professional with:
    - Experience level: ${experienceLevel}
    - Current/target role: ${jobTitle}
    - Key skills: ${skills.join(", ")}
    - Current salary: ${currentSalary}
    - Target salary: ${targetSalary}
    - Key strengths/achievements: ${strengths}

    The script should include:
    1. A brief opening that positions their value
    2. Specific talking points highlighting their skills and achievements
    3. A clear but diplomatic way to state their salary expectations
    4. Responses to potential pushback
    5. A fallback position if the target salary isn't achievable

    Format as a practical script they can adapt and use in a real negotiation.
    Keep the total response under 400 words and make it conversational.
  `

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt,
    temperature: 0.7,
    maxTokens: 1000,
  })

  return text.trim()
}

// Provide fallback responses when LLM is unavailable
function getFallbackResponse(type: RequestType) {
  // Return appropriate fallback based on request type
  switch (type) {
    case "insights":
      return [
        "Consider developing specialized skills that align with industry trends to increase your market value.",
        "Professionals with your experience level often benefit from expanding their network within the industry.",
        "Look for opportunities to lead projects that demonstrate your strategic thinking abilities.",
      ]
    case "normalize-title":
      return "Content Specialist"
    case "negotiation-script":
      return "We're sorry, but the negotiation script generator is currently unavailable. Please try again later."
    default:
      return "Unable to generate content. Please try again later."
  }
}
