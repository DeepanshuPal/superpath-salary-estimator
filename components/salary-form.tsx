"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import {
  InfoIcon,
  CheckCircle2,
  Briefcase,
  Brain,
  MapPin,
  User,
  Users,
  Building,
  GraduationCap,
  Clock,
} from "lucide-react"
import type { UserData } from "@/lib/types"
import { jobTitles, skills, locations, genders, ethnicities } from "@/lib/form-data"

interface SalaryFormProps {
  userData: UserData
  onUpdateUserData: (data: Partial<UserData>) => void
  onSubmit: () => void
  isComplete: boolean
}

export function SalaryForm({ userData, onUpdateUserData, onSubmit, isComplete }: SalaryFormProps) {
  const [activeTab, setActiveTab] = useState("professional")

  const handleNextTab = () => {
    if (activeTab === "professional") setActiveTab("skills")
    else if (activeTab === "skills") setActiveTab("personal")
    else if (activeTab === "personal" && isComplete) onSubmit()
  }

  const handlePrevTab = () => {
    if (activeTab === "skills") setActiveTab("professional")
    else if (activeTab === "personal") setActiveTab("skills")
  }

  const toggleSkill = (skill: string) => {
    const updatedSkills = userData.skills.includes(skill)
      ? userData.skills.filter((s) => s !== skill)
      : [...userData.skills, skill]
    onUpdateUserData({ skills: updatedSkills })
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-serif font-semibold mb-4">Your Profile</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger
            value="professional"
            className="data-[state=active]:bg-[#F8E3D2] data-[state=active]:text-[#F28C38]"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Professional
          </TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-[#F8E3D2] data-[state=active]:text-[#F28C38]">
            <Brain className="h-4 w-4 mr-2" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="personal" className="data-[state=active]:bg-[#F8E3D2] data-[state=active]:text-[#F28C38]">
            <MapPin className="h-4 w-4 mr-2" />
            Personal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="professional" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="experience-level" className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-[#F28C38]" />
                Experience Level
                <HoverCard>
                  <HoverCardTrigger>
                    <InfoIcon className="h-4 w-4 ml-1 text-gray-400" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-sm">Select your years of experience in content marketing.</p>
                  </HoverCardContent>
                </HoverCard>
              </Label>
              <Select
                value={userData.experienceLevel}
                onValueChange={(value) => onUpdateUserData({ experienceLevel: value })}
              >
                <SelectTrigger id="experience-level" className="w-full mt-1">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: "0-3", label: "Entry Level (0-3 years)" },
                    { value: "4-7", label: "Mid-Level (4-7 years)" },
                    { value: "8-12", label: "Senior (8-12 years)" },
                    { value: "13+", label: "Leadership (13+ years)" },
                  ].map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {userData.experienceLevel && (
              <div>
                <Label className="flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2 text-[#F28C38]" />
                  Years of Experience
                  <span className="ml-2 text-sm text-gray-500">
                    ({userData.experienceYears} {userData.experienceYears === 1 ? "year" : "years"})
                  </span>
                </Label>
                <Slider
                  value={[userData.experienceYears]}
                  min={0}
                  max={20}
                  step={1}
                  onValueChange={(value) => onUpdateUserData({ experienceYears: value[0] })}
                  className="py-4"
                />
              </div>
            )}

            <div>
              <Label htmlFor="employment-type" className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-[#F28C38]" />
                Employment Type
              </Label>
              <RadioGroup
                value={userData.employmentType}
                onValueChange={(value) => onUpdateUserData({ employmentType: value })}
                className="grid grid-cols-2 gap-2 mt-1"
              >
                {[
                  { value: "full-time", label: "Full-time" },
                  { value: "part-time", label: "Part-time" },
                  { value: "contract", label: "Contract" },
                  { value: "freelance", label: "Freelance" },
                ].map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={`employment-${type.value}`} />
                    <Label htmlFor={`employment-${type.value}`} className="text-sm cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="industry" className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-[#F28C38]" />
                Industry
              </Label>
              <Select value={userData.industry} onValueChange={(value) => onUpdateUserData({ industry: value })}>
                <SelectTrigger id="industry" className="w-full mt-1">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: "b2b", label: "B2B" },
                    { value: "b2c", label: "B2C/DTC" },
                    { value: "agency", label: "Agency" },
                    { value: "non-profit", label: "Non-profit/Higher Ed/Healthcare" },
                  ].map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="job-title" className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-[#F28C38]" />
                Job Title
              </Label>
              <Select value={userData.jobTitle} onValueChange={(value) => onUpdateUserData({ jobTitle: value })}>
                <SelectTrigger id="job-title" className="w-full mt-1">
                  <SelectValue placeholder="Select job title" />
                </SelectTrigger>
                <SelectContent>
                  {jobTitles.map((title) => (
                    <SelectItem key={title.value} value={title.value}>
                      {title.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <div>
            <Label className="flex items-center mb-2">
              <Brain className="h-4 w-4 mr-2 text-[#F28C38]" />
              Skills & Expertise
              <HoverCard>
                <HoverCardTrigger>
                  <InfoIcon className="h-4 w-4 ml-1 text-gray-400" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <p className="text-sm">
                    Select all skills that apply to your role. Each skill can impact your salary estimate.
                  </p>
                </HoverCardContent>
              </HoverCard>
            </Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {skills.map((skill) => {
                const isSelected = userData.skills.includes(skill.value)
                return (
                  <Button
                    key={skill.value}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    className={`justify-start h-auto py-2 px-3 text-left ${
                      isSelected ? "bg-[#F8E3D2] text-[#F28C38] hover:bg-[#F8E3D2]/90" : ""
                    }`}
                    onClick={() => toggleSkill(skill.value)}
                  >
                    <span className="flex items-center">
                      {isSelected && <CheckCircle2 className="h-4 w-4 mr-2" />}
                      <span className="text-sm">{skill.label}</span>
                    </span>
                  </Button>
                )
              })}
            </div>
            {userData.skills.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                {userData.skills.length} skill{userData.skills.length !== 1 ? "s" : ""} selected
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          <div>
            <Label htmlFor="location" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-[#F28C38]" />
              Location
              <HoverCard>
                <HoverCardTrigger>
                  <InfoIcon className="h-4 w-4 ml-1 text-gray-400" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <p className="text-sm">Your location can significantly impact salary ranges.</p>
                </HoverCardContent>
              </HoverCard>
            </Label>
            <Select value={userData.location} onValueChange={(value) => onUpdateUserData({ location: value })}>
              <SelectTrigger id="location" className="w-full mt-1">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="flex items-center mb-2">
                <Users className="h-4 w-4 mr-2 text-[#F28C38]" />
                Optional Demographics
                <Badge variant="outline" className="ml-2">
                  Optional
                </Badge>
                <HoverCard>
                  <HoverCardTrigger>
                    <InfoIcon className="h-4 w-4 ml-1 text-gray-400" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-sm">
                      This information helps us provide more accurate equitable salary estimates. All data is anonymous.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </Label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="gender-toggle" className="text-sm cursor-pointer flex items-center">
                  <User className="h-4 w-4 mr-2 text-[#F28C38]" />
                  Include gender in calculation
                </Label>
                <Switch
                  id="gender-toggle"
                  checked={userData.gender !== ""}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      onUpdateUserData({ gender: "" })
                    } else {
                      // Default to first option if turning on
                      onUpdateUserData({ gender: "prefer-not-to-say" })
                    }
                  }}
                />
              </div>

              {userData.gender !== "" && (
                <div className="mt-2">
                  <Select value={userData.gender} onValueChange={(value) => onUpdateUserData({ gender: value })}>
                    <SelectTrigger id="gender" className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((gender) => (
                        <SelectItem key={gender.value} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="ethnicity-toggle" className="text-sm cursor-pointer flex items-center">
                  <Users className="h-4 w-4 mr-2 text-[#F28C38]" />
                  Include ethnicity in calculation
                </Label>
                <Switch
                  id="ethnicity-toggle"
                  checked={userData.ethnicity !== ""}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      onUpdateUserData({ ethnicity: "" })
                    } else {
                      // Default to first option if turning on
                      onUpdateUserData({ ethnicity: "prefer-not-to-say" })
                    }
                  }}
                />
              </div>

              {userData.ethnicity !== "" && (
                <div className="mt-2">
                  <Select value={userData.ethnicity} onValueChange={(value) => onUpdateUserData({ ethnicity: value })}>
                    <SelectTrigger id="ethnicity" className="w-full">
                      <SelectValue placeholder="Select ethnicity" />
                    </SelectTrigger>
                    <SelectContent>
                      {ethnicities.map((ethnicity) => (
                        <SelectItem key={ethnicity.value} value={ethnicity.value}>
                          {ethnicity.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handlePrevTab} disabled={activeTab === "professional"}>
          Back
        </Button>
        <Button
          onClick={activeTab === "personal" ? onSubmit : handleNextTab}
          className={activeTab === "personal" ? "bg-[#F28C38] hover:bg-[#e07c28]" : ""}
          disabled={
            (activeTab === "professional" &&
              (!userData.experienceLevel || !userData.employmentType || !userData.industry || !userData.jobTitle)) ||
            (activeTab === "skills" && userData.skills.length === 0) ||
            (activeTab === "personal" && !userData.location)
          }
        >
          {activeTab === "personal" ? "Calculate Salary" : "Next"}
        </Button>
      </div>
    </div>
  )
}
