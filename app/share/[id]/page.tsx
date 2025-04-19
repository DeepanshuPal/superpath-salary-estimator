import { SalaryResults } from "@/components/salary-results"
import { calculateSalaryEstimate } from "@/lib/salary-algorithm"
import type { UserData } from "@/lib/types"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: "Shared Salary Estimate | Superpath Salary Compass",
    description: "View a shared content marketing salary estimate from Superpath Salary Compass.",
  }
}

export default function SharePage({ params, searchParams }: { params: { id: string }; searchParams: any }) {
  // In a real application, you would fetch the shared data from a database using the ID
  // For this demo, we'll use URL parameters to encode the necessary data

  try {
    // If we have search params with salary data, use them
    if (
      searchParams.exp &&
      searchParams.title &&
      searchParams.industry &&
      searchParams.location &&
      searchParams.type &&
      searchParams.skills
    ) {
      const userData: UserData = {
        experienceLevel: searchParams.exp,
        experienceYears: Number.parseInt(searchParams.years || "0"),
        jobTitle: searchParams.title,
        industry: searchParams.industry,
        location: searchParams.location,
        employmentType: searchParams.type,
        skills: searchParams.skills.split(","),
        gender: searchParams.gender || "",
        ethnicity: searchParams.ethnicity || "",
      }

      const results = calculateSalaryEstimate(userData)

      return (
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-[#F28C38]">Superpath Salary Compass</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Viewing a shared salary estimate based on experience, skills, and location.
            </p>
          </header>

          <div className="max-w-3xl mx-auto">
            <SalaryResults results={results} userData={userData} isCalculating={false} formSubmitted={true} />
          </div>
        </div>
      )
    } else {
      // If we don't have the necessary data, show a not found page
      return notFound()
    }
  } catch (error) {
    console.error("Error rendering shared salary:", error)
    return notFound()
  }
}
