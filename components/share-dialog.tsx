"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, X, Facebook, Twitter, Linkedin, MessageCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  salaryEstimate: number
}

export function ShareDialog({ isOpen, onClose, salaryEstimate }: ShareDialogProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Generate a unique URL for sharing (in a real app, this would be a proper URL)
  const shareUrl = `https://superpath.co/salary-estimator/${Math.random().toString(36).substring(2, 15)}`

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
    const text = `Check out my content marketing salary estimate of $${salaryEstimate.toLocaleString()} per year!`

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`
        break
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`
        break
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`
        break
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`
        break
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "width=600,height=400")
    }
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
            <Input ref={inputRef} readOnly value={shareUrl} className="h-10" />
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
            className="h-14 w-14 rounded-full bg-[#1DA1F2] hover:bg-[#0c85d0] border-none"
            onClick={() => handleSocialShare("twitter")}
          >
            <Twitter className="h-6 w-6 text-white" />
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
