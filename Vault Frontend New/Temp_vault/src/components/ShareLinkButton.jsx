import React, { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ShareLinkButton({ capsuleId }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    // Get the full URL including the origin
    const url = `${window.location.origin}/capsule/${capsuleId}`

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)

      alert("Link copied to clipboard!")

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
      alert("Failed to copy link. Please try again.")
    }
  }

  return (
    <div className="flex items-center gap-2 w-full max-w-md mx-auto">
      <code className="flex-1 px-4 py-2 rounded-md bg-black/10 dark:bg-white/10 font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap">
        {`${window.location.origin}/capsule/${capsuleId}`}
      </code>
      <Button
        onClick={handleCopy}
        size="sm"
        type="button"
        className={`transition-all duration-300 ${
          copied
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90"
        }`}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="sr-only">Copy link</span>
      </Button>
    </div>
  )
} 