import type { UserData, SalaryEstimateResult } from "./types"

// Sample data based on the PRD
const experienceLevelData = {
  "0-3": {
    baseSalary: 75004,
    trend: -0.12,
    range: [45000, 95000],
  },
  "4-7": {
    baseSalary: 94083,
    trend: -0.07,
    range: [65000, 115000],
  },
  "8-12": {
    baseSalary: 125624,
    trend: -0.04,
    range: [90000, 160000],
  },
  "13+": {
    baseSalary: 142533,
    trend: 0.12,
    range: [110000, 200000],
  },
}

const jobTitleMultipliers = {
  writer: { value: 0.82, description: "Content Writers typically earn less than the average" },
  specialist: { value: 0.85, description: "Content Specialists earn slightly below average" },
  strategist: { value: 0.84, description: "Content Strategists earn slightly below average" },
  manager: { value: 0.98, description: "Content Managers earn close to the average" },
  lead: { value: 1.08, description: "Content Leads earn above average" },
  senior: { value: 1.09, description: "Senior roles command higher salaries" },
  head: { value: 1.11, description: "Head of Content roles earn significantly more" },
  director: { value: 1.42, description: "Directors earn well above average" },
  vp: { value: 2.28, description: "VP positions command the highest salaries" },
}

const industryMultipliers = {
  b2b: { value: 1.02, description: "B2B content marketing typically pays above average" },
  b2c: { value: 0.97, description: "B2C/DTC content marketing pays slightly below average" },
  "non-profit": { value: 0.84, description: "Non-profit/healthcare/higher ed typically pays less" },
}

const employmentTypeMultipliers = {
  "full-time": { value: 1.01, description: "Full-time roles offer slightly higher compensation" },
  freelance: { value: 0.97, description: "Freelance roles have more variable compensation" },
}

const locationMultipliers = {
  us: { value: 1.18, description: "US-based roles pay significantly higher" },
  canada: { value: 0.87, description: "Canadian roles pay slightly below global average" },
  uk: { value: 0.86, description: "UK roles pay slightly below global average" },
  europe: { value: 0.85, description: "European roles pay below global average" },
  australia: { value: 0.92, description: "Australian/NZ roles pay slightly below global average" },
  asia: { value: 0.75, description: "Asian markets typically pay less for content roles" },
  other: { value: 0.8, description: "Other regions typically pay below global average" },
}

const skillsImpact = {
  writing: 0.0,
  strategy: 0.04,
  seo: -0.01,
  social: -0.03,
  email: -0.07,
  analytics: 0.02,
  management: 0.2,
  client: -0.06,
  vendor: 0.22,
  video: 0.05,
  design: 0.03,
  technical: 0.08,
}

// Gender and ethnicity multipliers (for market reality, not equitable rates)
const genderMultipliers = {
  male: { value: 1.1, description: "Males typically earn more in content marketing" },
  female: { value: 0.97, description: "Females typically earn less than male counterparts" },
  "non-binary": { value: 0.96, description: "Non-binary individuals typically earn less" },
  "prefer-not-to-say": { value: 1.0, description: "" },
}

export function calculateSalaryEstimate(userData: UserData): SalaryEstimateResult {
  // 1. Get base salary by experience
  const expLevel = userData.experienceLevel || "4-7" // Default to mid-level if not specified
  const expData = experienceLevelData[expLevel as keyof typeof experienceLevelData]
  const baseSalary = expData.baseSalary

  // 2. Calculate adjustments for each factor
  const adjustments: Record<string, any> = {}

  // Job Title adjustment
  const jobTitle = userData.jobTitle || "specialist"
  const jobTitleMultiplier = jobTitleMultipliers[jobTitle as keyof typeof jobTitleMultipliers]
  adjustments.jobTitle = {
    impact: jobTitleMultiplier.value - 1,
    description: jobTitleMultiplier.description,
  }

  // Industry adjustment
  const industry = userData.industry || "b2b"
  const industryMultiplier = industryMultipliers[industry as keyof typeof industryMultipliers]
  adjustments.industry = {
    impact: industryMultiplier.value - 1,
    description: industryMultiplier.description,
  }

  // Employment Type adjustment
  const employmentType = userData.employmentType || "full-time"
  const employmentMultiplier = employmentTypeMultipliers[employmentType as keyof typeof employmentTypeMultipliers]
  adjustments.employmentType = {
    impact: employmentMultiplier.value - 1,
    description: employmentMultiplier.description,
  }

  // Location adjustment
  const location = userData.location || "us"
  const locationMultiplier = locationMultipliers[location as keyof typeof locationMultipliers]
  adjustments.location = {
    impact: locationMultiplier.value - 1,
    description: locationMultiplier.description,
  }

  // Skills adjustment
  let skillsMultiplier = 1.0
  if (userData.skills.length > 0) {
    let skillsImpactTotal = 0
    userData.skills.forEach((skill) => {
      skillsImpactTotal += skillsImpact[skill as keyof typeof skillsImpact] || 0
    })
    // Normalize based on number of skills
    const normalizedSkillsImpact = skillsImpactTotal / Math.max(1, userData.skills.length)
    skillsMultiplier = 1 + normalizedSkillsImpact
  }

  adjustments.skills = {
    impact: skillsMultiplier - 1,
    description: userData.skills.length > 0 ? "Your skill set impacts your market value" : "No skills selected",
  }

  // Gender adjustment (optional)
  if (userData.gender && userData.gender !== "prefer-not-to-say") {
    const genderMultiplier = genderMultipliers[userData.gender as keyof typeof genderMultipliers]
    adjustments.gender = {
      impact: genderMultiplier.value - 1,
      description: genderMultiplier.description,
    }
  }

  // 3. Calculate final salary estimate
  let adjustmentFactor = 1.0
  Object.values(adjustments).forEach((adjustment: any) => {
    adjustmentFactor *= 1 + adjustment.impact
  })

  const estimatedSalary = Math.round(baseSalary * adjustmentFactor)

  // 4. Calculate salary range
  const rangeMin = Math.round(estimatedSalary * 0.85)
  const rangeMax = Math.round(estimatedSalary * 1.15)

  // 5. Generate insights
  const insights = generateInsights(userData, adjustments, estimatedSalary)

  return {
    estimate: estimatedSalary,
    range: {
      min: rangeMin,
      max: rangeMax,
    },
    adjustments,
    insights,
    trend: expData.trend,
  }
}

function generateInsights(userData: UserData, adjustments: Record<string, any>, salary: number): string[] {
  const insights: string[] = []

  // Experience-based insights
  if (userData.experienceLevel === "0-3") {
    insights.push(
      "Early career content marketers can increase their salary by focusing on developing specialized skills like content strategy.",
    )
  } else if (userData.experienceLevel === "4-7") {
    insights.push(
      "Mid-career professionals often see salary increases by taking on management responsibilities or specializing in high-demand areas.",
    )
  } else if (userData.experienceLevel === "8-12" || userData.experienceLevel === "13+") {
    insights.push(
      "Experienced content marketers command higher salaries when they combine strategic vision with people management skills.",
    )
  }

  // Job title insights
  if (userData.jobTitle === "writer" || userData.jobTitle === "specialist") {
    insights.push(
      "Consider developing strategic skills to move into higher-paying content strategy or management roles.",
    )
  } else if (userData.jobTitle === "director" || userData.jobTitle === "vp") {
    insights.push("Your leadership position commands one of the highest salaries in content marketing.")
  }

  // Skills insights
  if (userData.skills.includes("management")) {
    insights.push("Your people management skills significantly increase your market value in content marketing.")
  }
  if (!userData.skills.includes("strategy") && !userData.skills.includes("management")) {
    insights.push(
      "Adding content strategy or people management to your skill set could increase your earning potential.",
    )
  }

  // Location insights
  if (userData.location && userData.location !== "us") {
    insights.push("Content marketing roles in the US typically pay higher than other regions for similar positions.")
  }

  return insights
}
