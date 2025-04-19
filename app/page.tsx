import { SalaryEstimator } from "@/components/salary-estimator"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <SalaryEstimator />
      <Toaster />
    </main>
  )
}
