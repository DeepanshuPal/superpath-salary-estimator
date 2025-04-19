"use client"
import jsPDF from "jspdf"
import { formatCurrency } from "@/lib/utils"
import type { UserData, SalaryEstimateResult } from "@/lib/types"

interface PdfReportGeneratorProps {
  userData: UserData
  results: SalaryEstimateResult
}

export function generateSalaryPdf(userData: UserData, results: SalaryEstimateResult): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Set font sizes and margins
      const margin = 20
      const pageWidth = 210
      const contentWidth = pageWidth - margin * 2

      // Add Superpath logo and header
      pdf.setFillColor(248, 227, 210)
      pdf.rect(0, 0, pageWidth, 40, "F")

      pdf.setTextColor(242, 140, 56)
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(22)
      pdf.text("Content Marketing Salary Report", margin, 15)

      pdf.setTextColor(100, 100, 100)
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "normal")
      pdf.text("Superpath", margin, 25)

      const today = new Date()
      pdf.text(`Generated on ${today.toLocaleDateString()}`, margin, 35)

      // Salary estimate section
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.text("Your Estimated Salary", margin, 55)

      pdf.setFontSize(28)
      pdf.setTextColor(242, 140, 56)
      pdf.text(formatCurrency(results.estimate), margin, 70)

      pdf.setFontSize(12)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Range: ${formatCurrency(results.range.min)} - ${formatCurrency(results.range.max)}`, margin, 80)

      // Profile section
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.text("Your Profile", margin, 95)

      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")

      const experienceLevelMap: Record<string, string> = {
        "0-3": "0-3 years",
        "4-7": "4-7 years",
        "8-12": "8-12 years",
        "13+": "13+ years",
      }

      const jobTitleMap: Record<string, string> = {
        writer: "Content Writer",
        specialist: "Content Specialist",
        strategist: "Content Strategist",
        manager: "Content Manager",
        lead: "Content Lead",
        senior: "Senior Content Marketer",
        head: "Head of Content",
        director: "Content Director",
        vp: "VP of Content",
      }

      const industryMap: Record<string, string> = {
        b2b: "B2B",
        b2c: "B2C/DTC",
        agency: "Agency",
        "non-profit": "Non-profit/Higher Ed/Healthcare",
      }

      const locationMap: Record<string, string> = {
        us: "United States",
        canada: "Canada",
        uk: "United Kingdom",
        europe: "Europe (Other)",
        australia: "Australia/New Zealand",
        asia: "Asia",
        other: "Other",
      }

      const employmentTypeMap: Record<string, string> = {
        "full-time": "Full-time",
        "part-time": "Part-time",
        contract: "Contract",
        freelance: "Freelance",
      }

      const profileItems = [
        `Experience Level: ${experienceLevelMap[userData.experienceLevel] || userData.experienceLevel}`,
        `Job Title: ${jobTitleMap[userData.jobTitle] || userData.jobTitle}`,
        `Industry: ${industryMap[userData.industry] || userData.industry}`,
        `Location: ${locationMap[userData.location] || userData.location}`,
        `Employment Status: ${employmentTypeMap[userData.employmentType] || userData.employmentType}`,
        `Skills: ${userData.skills.join(", ")}`,
      ]

      let yPos = 105
      profileItems.forEach((item) => {
        pdf.text(item, margin, yPos)
        yPos += 7
      })

      // Comparison section
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.text("How You Compare", margin, yPos + 10)

      yPos += 20

      // Industry average comparison
      const industryAverage = 114176 // From the PRD data
      const industryDiff = results.estimate - industryAverage
      const industryPercent = Math.round((Math.abs(industryDiff) / industryAverage) * 100)

      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")
      pdf.text(`Industry Average: ${formatCurrency(industryAverage)}`, margin, yPos)

      yPos += 7
      pdf.text(`Your estimate is ${industryPercent}% ${industryDiff >= 0 ? "above" : "below"} average`, margin, yPos)

      yPos += 10

      // Experience level comparison
      const experienceLevelMedian =
        {
          "0-3": 75004,
          "4-7": 94083,
          "8-12": 125624,
          "13+": 142533,
        }[userData.experienceLevel] || 100000

      const expLevelDiff = results.estimate - experienceLevelMedian
      const expLevelPercent = Math.round((Math.abs(expLevelDiff) / experienceLevelMedian) * 100)

      pdf.text(`Experience Level Average: ${formatCurrency(experienceLevelMedian)}`, margin, yPos)

      yPos += 7
      pdf.text(
        `Your estimate is ${expLevelPercent}% ${expLevelDiff >= 0 ? "above" : "below"} your experience level`,
        margin,
        yPos,
      )

      // Insights section
      yPos += 20
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.text("Insights", margin, yPos)

      yPos += 10
      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")

      results.insights.forEach((insight) => {
        // Check if we need to add a new page
        if (yPos > 270) {
          pdf.addPage()
          yPos = 20
        }

        pdf.text(`• ${insight}`, margin, yPos)
        yPos += 7
      })

      // Footer
      pdf.setFillColor(248, 227, 210)
      pdf.rect(0, 277, pageWidth, 20, "F")

      pdf.setTextColor(100, 100, 100)
      pdf.setFontSize(9)
      pdf.text("Powered by Superpath Content Marketing Salary Estimator", margin, 287)
      pdf.text("www.superpath.com", margin, 292)

      // Save the PDF
      pdf.save("content-marketing-salary-report.pdf")
      resolve(true)
    } catch (error) {
      console.error("Error generating PDF:", error)
      resolve(false)
    }
  })
}
