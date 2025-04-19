"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, X, Facebook, Linkedin, MessageCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { UserData } from "@/lib/types"

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  salaryEstimate: number
  userData: UserData
}

export function ShareDialog({ isOpen, onClose, salaryEstimate, userData }: ShareDialogProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Generate a unique URL for sharing with salarycompass.xyz domain
  const uniqueId = Math.random().toString(36).substring(2, 15)

  // Create a shareable URL that includes the necessary data as query parameters
  const shareUrl = new URL(`https://salarycompass.xyz/share/${uniqueId}`)

  // Add user data as query parameters
  shareUrl.searchParams.set("exp", userData.experienceLevel)
  shareUrl.searchParams.set("years", userData.experienceYears.toString())
  shareUrl.searchParams.set("title", userData.jobTitle)
  shareUrl.searchParams.set("industry", userData.industry)
  shareUrl.searchParams.set("location", userData.location)
  shareUrl.searchParams.set("type", userData.employmentType)
  shareUrl.searchParams.set("skills", userData.skills.join(","))

  if (userData.gender) {
    shareUrl.searchParams.set("gender", userData.gender)
  }

  if (userData.ethnicity) {
    shareUrl.searchParams.set("ethnicity", userData.ethnicity)
  }

  const handleCopy = () => {
    if (inputRef.current) {
      inputRef.current.select()
      navigator.clipboard.writeText(inputRef.current.value)
      setCopied(true)
      toast({
        title: "Link Copied",
        description: "Share link has been copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSocialShare = (platform: string) => {
    let shareLink = ""
    const text = `Check out my content marketing salary estimate of ${formatCurrency(salaryEstimate)} per year!`

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.toString())}&quote=${encodeURIComponent(text)}`
        break
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl.toString())}&text=${encodeURIComponent(text)}`
        break
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl.toString())}&title=${encodeURIComponent(text)}`
        break
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl.toString())}`
        break
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "width=600,height=400")
    }
  }

  // Helper function to format currency
  function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Share Your Results</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Share your salary estimate with others or save the link for future reference.
          </DialogDescription>
          <Button variant="ghost" className="absolute right-4 top-4 rounded-full p-2 h-auto" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input ref={inputRef} readOnly value={shareUrl.toString()} className="h-10" />
          </div>
          <Button size="icon" className="h-10 w-10 bg-[#F28C38] hover:bg-[#e07c28]" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center space-x-6 mt-6">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full bg-[#4267B2] hover:bg-[#365899] border-none"
            onClick={() => handleSocialShare("facebook")}
          >
            <Facebook className="h-6 w-6 text-white" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full bg-[#000000] hover:bg-[#333333] border-none"
            onClick={() => handleSocialShare("twitter")}
          >
            {/* X logo instead of Twitter bird */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-white"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full bg-[#0077B5] hover:bg-[#006097] border-none"
            onClick={() => handleSocialShare("linkedin")}
          >
            <Linkedin className="h-6 w-6 text-white" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] border-none"
            onClick={() => handleSocialShare("whatsapp")}
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
