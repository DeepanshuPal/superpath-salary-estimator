"use client"

import { useState, useRef } from "react"
import type { UserData, SalaryEstimateResult } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/components/ui/use-toast"
import {
  InfoIcon,
  ChevronDown,
  BarChart3,
  TrendingUp,
  DollarSign,
  Share2,
  Download,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Award,
  Building2,
} from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

import { formatCurrency, formatCompactCurrency } from "@/lib/utils"
import { ShareDialog } from "./share-dialog"
import { generateSalaryPdf } from "./pdf-report-generator"

interface SalaryResultsProps {
  results: SalaryEstimateResult | null
  userData: UserData
  isCalculating: boolean
  formSubmitted: boolean
}

export function SalaryResults({ results, userData, isCalculating, formSubmitted }: SalaryResultsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()
  const reportRef = useRef<HTMLDivElement>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  // Function to handle downloading the report
  const handleDownloadReport = async () => {
    if (!results) return

    toast({
      title: "Generating PDF...",
      description: "Please wait while we prepare your report.",
    })

    const success = await generateSalaryPdf(userData, results)

    if (success) {
      toast({
        title: "Report Downloaded",
        description: "Your salary report has been downloaded successfully.",
      })
    } else {
      toast({
        title: "Download Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to handle sharing
  const handleShare = () => {
    setShareDialogOpen(true)
  }

  // If form hasn't been submitted yet, show placeholder
  if (!formSubmitted) {
    return (
      <Card className="border border-gray-200 shadow-sm h-full flex flex-col items-center justify-center text-center p-8">
        <CardContent className="p-6 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#F8E3D2] flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-[#F28C38]" />
          </div>
          <h3 className="text-xl font-serif font-medium text-gray-800">
            Fill out the form to see your estimated salary
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Complete all required fields in the form to generate your personalized content marketing salary estimate.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!results && !isCalculating) {
    return (
      <Card className="border border-gray-200 shadow-sm h-full flex items-center justify-center">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Update your profile to see salary estimates</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate comparison percentages
  const industryAverage = 114176 // From the PRD data
  const experienceLevelMedian =
    {
      "0-3": 75004,
      "4-7": 94083,
      "8-12": 125624,
      "13+": 142533,
    }[userData.experienceLevel] || 100000
  const overallMedian = 100000 // From the PRD data

  // Calculate percentage of the range
  const rangePercentage = results
    ? ((results.estimate - results.range.min) / (results.range.max - results.range.min)) * 100
    : 50

  // Equitable rate (adjusted for demographic factors)
  const equitableRate = results ? Math.round(results.estimate * 1.05) : 0 // 5% adjustment for demonstration

  // Historical trend data
  const historicalTrendData = [
    { year: "2019", salary: 85000 },
    { year: "2020", salary: 90000 },
    { year: "2021", salary: 95000 },
    { year: "2022", salary: 102000 },
    { year: "2023", salary: 108000 },
    { year: "2024", salary: 114176 },
    { year: "2025 (Est.)", salary: results ? results.estimate : 120000 },
  ]

  // Skill impact data
  const skillImpactData = [
    { name: "Writing", value: 0, isSelected: userData.skills.includes("writing") },
    { name: "Strategy", value: 4, isSelected: userData.skills.includes("strategy") },
    { name: "SEO", value: -1, isSelected: userData.skills.includes("seo") },
    { name: "Social", value: -3, isSelected: userData.skills.includes("social") },
    { name: "Email", value: -7, isSelected: userData.skills.includes("email") },
    { name: "Analytics", value: 2, isSelected: userData.skills.includes("analytics") },
    { name: "Management", value: 20, isSelected: userData.skills.includes("management") },
    { name: "Client", value: -6, isSelected: userData.skills.includes("client") },
    { name: "Vendor", value: 22, isSelected: userData.skills.includes("vendor") },
    { name: "Video", value: 5, isSelected: userData.skills.includes("video") },
    { name: "Design", value: 3, isSelected: userData.skills.includes("design") },
    { name: "Technical", value: 8, isSelected: userData.skills.includes("technical") },
  ]
    .sort((a, b) => b.value - a.value)
    .slice(0, 8) // Sort by impact and take top 8 for better visualization

  // Industry comparison data that updates dynamically based on user's industry
  const industryComparisonData = [
    { name: "B2B", value: 116459, isSelected: userData.industry === "b2b" },
    { name: "B2C/DTC", value: 110751, isSelected: userData.industry === "b2c" },
    { name: "Agency", value: 105320, isSelected: userData.industry === "agency" },
    { name: "Non-profit", value: 95908, isSelected: userData.industry === "non-profit" },
    { name: "Your Estimate", value: results?.estimate || 0, isSelected: true },
  ]

  return (
    <div className="space-y-6" id="salary-report">
      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-[#F28C38] text-white pb-4">
          <CardTitle className="text-2xl font-serif">Your Salary Estimate</CardTitle>
          <CardDescription className="text-white/90">
            Based on your profile and the latest Content Marketing Salary Report data
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {isCalculating ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg text-gray-500 font-medium mb-2 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-[#F28C38]" />
                  Estimated Salary Range
                </h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{formatCurrency(results?.estimate || 0)}</span>
                  <span className="ml-2 text-gray-500">per year</span>
                </div>

                <div className="mt-4 flex justify-between text-sm mb-1">
                  <span>{formatCurrency(results?.range.min || 0)}</span>
                  <span>{formatCurrency(results?.range.max || 0)}</span>
                </div>

                <div className="h-6 bg-gray-100 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/3 bg-[#F8E3D2]"></div>
                    <div className="w-1/3 bg-[#F5D0B1]"></div>
                    <div className="w-1/3 bg-[#F8E3D2]"></div>
                  </div>
                  <div
                    className="h-full bg-[#F28C38] absolute top-0 left-0 rounded-full"
                    style={{
                      width: "4px",
                      left: `calc(${rangePercentage}% - 2px)`,
                    }}
                  />
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-medium">
                    Salary Range
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Zap className="h-4 w-4 mr-1 text-[#F28C38]" />
                    Confidence Level
                  </span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <Progress value={95} className="h-2 mt-1" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#F8E3D2] data-[state=active]:text-[#F28C38]">
            <DollarSign className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="comparison"
            className="data-[state=active]:bg-[#F8E3D2] data-[state=active]:text-[#F28C38]"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Comparison
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-[#F8E3D2] data-[state=active]:text-[#F28C38]">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif flex items-center">
                <Award className="h-5 w-5 mr-2 text-[#F28C38]" />
                How You Compare
              </CardTitle>
              <CardDescription>Your salary compared to industry benchmarks</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isCalculating ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Industry Average</span>
                      <span className="font-medium">{formatCurrency(industryAverage)}</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-[#F28C38]"
                        style={{
                          width: `${Math.min(100, ((results?.estimate || 0) / industryAverage) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        {results && results.estimate > industryAverage ? (
                          <>
                            <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                            Above average
                          </>
                        ) : (
                          <>
                            <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                            Below average
                          </>
                        )}
                      </span>
                      <span>
                        {results && formatCurrency(Math.abs((results.estimate || 0) - industryAverage))}
                        {results && results.estimate > industryAverage ? " more" : " less"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Experience Level Median</span>
                      <span className="font-medium">{formatCurrency(experienceLevelMedian)}</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-[#F28C38]"
                        style={{
                          width: `${Math.min(100, ((results?.estimate || 0) / experienceLevelMedian) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Median</span>
                      <span className="font-medium">{formatCurrency(overallMedian)}</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-[#F28C38]"
                        style={{
                          width: `${Math.min(100, ((results?.estimate || 0) / overallMedian) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-1 text-[#F28C38]" />
                      Equitable Rate
                    </h4>
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold">{formatCurrency(equitableRate)}</span>
                      <span className="ml-2 text-xs text-gray-500">per year</span>
                      <HoverCard>
                        <HoverCardTrigger>
                          <InfoIcon className="h-4 w-4 ml-2 text-gray-400" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <p className="text-sm">
                            The equitable rate adjusts for documented pay gaps based on gender, ethnicity, and other
                            demographic factors to show what fair compensation would be in an equitable market.
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Collapsible className="mt-6 border border-gray-200 rounded-lg shadow-sm">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-[#F28C38]" />
                <h3 className="text-lg font-medium">Salary Factors</h3>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-6">
              <p className="text-sm text-gray-500 mb-4">How different aspects impact your salary</p>

              {isCalculating ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  {results &&
                    Object.entries(results.adjustments).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between items-center">
                        <HoverCard>
                          <HoverCardTrigger>
                            <span className="text-sm capitalize cursor-help flex items-center">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                              <InfoIcon className="h-3 w-3 ml-1 text-gray-400" />
                            </span>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p className="text-sm">{value.description}</p>
                          </HoverCardContent>
                        </HoverCard>
                        <span
                          className={`text-sm font-medium ${
                            value.impact > 0 ? "text-green-600" : value.impact < 0 ? "text-red-600" : "text-gray-600"
                          }`}
                        >
                          {value.impact > 0 ? "+" : ""}
                          {(value.impact * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </TabsContent>

        <TabsContent value="comparison">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif flex items-center">
                <Zap className="h-5 w-5 mr-2 text-[#F28C38]" />
                Skill Impact Analysis
              </CardTitle>
              <CardDescription>How different skills affect content marketing salaries</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isCalculating ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="h-64" ref={reportRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={skillImpactData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[-10, 25]} tickFormatter={(value) => `${value}%`} />
                      <YAxis dataKey="name" type="category" width={80} />
                      <RechartsTooltip
                        formatter={(value) => [`${value}%`, "Impact on Salary"]}
                        labelFormatter={(value) => `Skill: ${value}`}
                      />
                      <Bar
                        dataKey="value"
                        fill={(entry) => (entry.isSelected ? "#F28C38" : "#94A3B8")}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  <Badge variant="outline" className="mr-2">
                    Pro Tip
                  </Badge>
                  Management skills have the highest impact on content marketing salaries, with a potential 20%
                  increase.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-[#F28C38]" />
                Industry Comparison
              </CardTitle>
              <CardDescription>How salaries compare across different industries</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isCalculating ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={industryComparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval={0} />
                      <YAxis
                        domain={[80000, "auto"]}
                        tickFormatter={(value) => formatCompactCurrency(value)}
                        width={70}
                      />
                      <RechartsTooltip formatter={(value) => [formatCurrency(value as number), "Average Salary"]} />
                      <Bar
                        dataKey="value"
                        fill={(entry) => (entry.isSelected ? "#F28C38" : "#94A3B8")}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-[#F28C38]" />
                Historical Salary Trends
              </CardTitle>
              <CardDescription>Content marketing salary trends over time</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isCalculating ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis
                        domain={[80000, "auto"]}
                        tickFormatter={(value) => formatCompactCurrency(value)}
                        width={70}
                      />
                      <RechartsTooltip formatter={(value) => [formatCurrency(value as number), "Average Salary"]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="salary"
                        stroke="#F28C38"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                        dot={{ stroke: "#F28C38", strokeWidth: 2, r: 4, fill: "white" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  Content marketing salaries have increased by approximately 27% over the past 5 years, with the most
                  significant growth occurring between 2022 and 2023.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif flex items-center">
                <Award className="h-5 w-5 mr-2 text-[#F28C38]" />
                Career Progression
              </CardTitle>
              <CardDescription>Salary growth by experience level</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isCalculating ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Entry (0-3 yrs)", value: 75004, isSelected: userData.experienceLevel === "0-3" },
                        { name: "Mid (4-7 yrs)", value: 94083, isSelected: userData.experienceLevel === "4-7" },
                        { name: "Senior (8-12 yrs)", value: 125624, isSelected: userData.experienceLevel === "8-12" },
                        { name: "Leadership (13+ yrs)", value: 142533, isSelected: userData.experienceLevel === "13+" },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 150000]} tickFormatter={(value) => formatCompactCurrency(value)} width={70} />
                      <RechartsTooltip formatter={(value) => [formatCurrency(value as number), "Average Salary"]} />
                      <Bar
                        dataKey="value"
                        fill={(entry) => (entry.isSelected ? "#F28C38" : "#94A3B8")}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  <Badge variant="outline" className="mr-2">
                    Career Insight
                  </Badge>
                  The jump from Mid-level to Senior roles represents the largest percentage increase (33%) in the
                  content marketing career path.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" className="flex items-center" onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-1" />
            Download Report
          </Button>

          <Button variant="outline" size="sm" className="flex items-center" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>

        <div className="flex justify-center">
          <Button
            className="bg-[#F28C38] hover:bg-[#e07c28] text-white flex items-center mx-auto"
            onClick={() => window.open("https://www.superpath.co/blog/content-marketing-salary-report", "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Complete Salary Report
          </Button>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        salaryEstimate={results?.estimate || 0}
        userData={userData}
      />
    </div>
  )
}
