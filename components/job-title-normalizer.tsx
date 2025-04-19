"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLlm } from "@/lib/hooks/use-llm"
import { Loader2 } from "lucide-react"

interface JobTitleNormalizerProps {
  onSelect: (normalizedTitle: string) => void
}

export function JobTitleNormalizer({ onSelect }: JobTitleNormalizerProps) {
  const [customTitle, setCustomTitle] = useState("")

  const {
    data: normalizedTitle,
    isLoading,
    error,
    request: normalizeTitle,
  } = useLlm({
    fallbackData: null,
  })

  const handleNormalize = async () => {
    if (!customTitle.trim()) return

    const result = await normalizeTitle("normalize-title", { title: customTitle })
    if (result && typeof result === "string") {
      onSelect(result)
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-sm">
        <p>Don't see your exact job title? Enter it below and we'll match it to the closest category.</p>
      </div>

      <div className="flex gap-2">
        <Input
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder="e.g., Content Ninja, Digital Storyteller"
          className="flex-1"
        />
        <Button type="button" variant="outline" onClick={handleNormalize} disabled={isLoading || !customTitle.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          Normalize
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-500">Unable to normalize job title. Please select from the dropdown instead.</p>
      )}

      {normalizedTitle && !error && (
        <div className="text-sm">
          <p>
            Matched to: <span className="font-medium">{normalizedTitle}</span>{" "}
            <Button variant="link" className="p-0 h-auto text-[#F28C38]" onClick={() => onSelect(normalizedTitle)}>
              Use this
            </Button>
          </p>
        </div>
      )}
    </div>
  )
}
