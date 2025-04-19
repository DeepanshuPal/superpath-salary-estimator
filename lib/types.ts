export interface UserData {
  experienceLevel: string
  experienceYears: number
  employmentType: string
  industry: string
  jobTitle: string
  skills: string[]
  location: string
  gender: string
  ethnicity: string
}

export interface SalaryRange {
  min: number
  max: number
}

export interface SalaryAdjustment {
  impact: number
  description: string
}

export interface SalaryAdjustments {
  [key: string]: SalaryAdjustment
}

export interface SalaryEstimateResult {
  estimate: number
  range: SalaryRange
  adjustments: SalaryAdjustments
  insights: string[]
  trend: number
}
