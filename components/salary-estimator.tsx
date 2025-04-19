"use client"

import { useState, useEffect } from "react"
import { SalaryForm } from "./salary-form"
import { SalaryResults } from "./salary-results"
import { calculateSalaryEstimate } from "@/lib/salary-algorithm"
import type { UserData, SalaryEstimateResult } from "@/lib/types"
import { Card } from "@/components/ui/card"

export function SalaryEstimator() {
  const [userData, setUserData] = useState<UserData>({
    experienceLevel: "",
    experienceYears: 0,
    employmentType: "",
    industry: "",
    jobTitle: "",
    skills: [],
    location: "",
    gender: "",
    ethnicity: "",
  })

  const [results, setResults] = useState<SalaryEstimateResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Calculate results whenever userData changes and form has been submitted
  useEffect(() => {
    if (!formSubmitted || !isFormComplete(userData)) return

    setIsCalculating(true)
    // Add a small delay to show the calculation animation
    const timer = setTimeout(() => {
      try {
        const estimationResults = calculateSalaryEstimate(userData)
        setResults(estimationResults)
      } catch (error) {
        console.error("Error calculating salary estimate:", error)
      } finally {
        setIsCalculating(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [userData, formSubmitted])

  const isFormComplete = (data: UserData): boolean => {
    return !!(
      data.experienceLevel &&
      data.employmentType &&
      data.industry &&
      data.jobTitle &&
      data.skills.length > 0 &&
      data.location
    )
  }

  const handleUpdateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }))
  }

  const handleSubmitForm = () => {
    if (isFormComplete(userData)) {
      setFormSubmitted(true)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-[#F28C38]">Superpath Salary Compass</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get a personalized salary estimate based on your experience, skills, and location.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:sticky lg:top-8 lg:self-start">
          <Card className="border border-gray-200 shadow-sm">
            <SalaryForm
              userData={userData}
              onUpdateUserData={handleUpdateUserData}
              onSubmit={handleSubmitForm}
              isComplete={isFormComplete(userData)}
            />
          </Card>
        </div>

        <div>
          <SalaryResults
            results={results}
            userData={userData}
            isCalculating={isCalculating}
            formSubmitted={formSubmitted}
          />
        </div>
      </div>
    </div>
  )
}
