"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BadgeCheck, Briefcase, TrendingUp, Users, Laptop } from "lucide-react"

interface AudienceEntryProps {
  onSelectAudience: (audience: string, prefilledData: any) => void
}

export function AudienceEntry({ onSelectAudience }: AudienceEntryProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const audienceTypes = [
    {
      id: "early-career",
      title: "Early Career",
      description: "0-3 years of experience in content marketing",
      icon: <TrendingUp className="h-10 w-10 text-[#F28C38]" />,
      prefilledData: {
        experienceLevel: "0-3",
        employmentType: "full-time",
      },
    },
    {
      id: "mid-career",
      title: "Mid-Career Professional",
      description: "4+ years of experience, looking to advance",
      icon: <Briefcase className="h-10 w-10 text-[#F28C38]" />,
      prefilledData: {
        experienceLevel: "4-7",
        employmentType: "full-time",
      },
    },
    {
      id: "freelancer",
      title: "Freelancer",
      description: "Independent content marketing professional",
      icon: <Laptop className="h-10 w-10 text-[#F28C38]" />,
      prefilledData: {
        employmentType: "freelance",
      },
    },
    {
      id: "hiring-manager",
      title: "Hiring Manager",
      description: "Looking to set competitive compensation",
      icon: <Users className="h-10 w-10 text-[#F28C38]" />,
      prefilledData: {
        employmentType: "full-time",
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 text-[#F28C38]">Content Marketing Salary Estimator</h1>
        <p className="text-gray-600">
          Get a personalized salary estimate based on your experience, skills, and location. Select your profile to get
          started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {audienceTypes.map((audience) => (
          <Card
            key={audience.id}
            className={`border cursor-pointer transition-all ${
              hoveredCard === audience.id ? "border-[#F28C38] shadow-md" : "border-gray-200"
            }`}
            onMouseEnter={() => setHoveredCard(audience.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onSelectAudience(audience.id, audience.prefilledData)}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center p-4">
                {audience.icon}
                <h3 className="mt-4 text-xl font-medium">{audience.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{audience.description}</p>
              </div>
            </CardContent>
            <CardFooter className="justify-center pb-6">
              <Button
                variant="ghost"
                className={`text-sm ${hoveredCard === audience.id ? "text-[#F28C38]" : "text-gray-500"}`}
              >
                Start Here
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-[#F8E3D2] p-6 rounded-lg max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <BadgeCheck className="h-6 w-6 text-[#F28C38] mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Based on Real Data</h3>
            <p className="text-sm text-gray-600 mt-1">
              Our estimates are based on Superpath's comprehensive Content Marketing Salary Report, with data from over
              300 content marketing professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
