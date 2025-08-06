import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Lock, Calendar, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShareLinkButton } from "@/components/ShareLinkButton"
import { getCapsuleByPublicId } from "@/lib/api"

export default function CapsuleDetail() {
  const { public_id } = useParams()
  const [capsule, setCapsule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Debug logging
  useEffect(() => {
    console.log("CapsuleDetail mounted")
    console.log("URL params:", { public_id })
    console.log("Current URL:", window.location.href)
  }, [])

  useEffect(() => {
    if (!public_id) {
      console.error("No public_id provided in URL params")
      setError("No capsule ID provided")
      setLoading(false)
      return
    }

    const fetchCapsule = async () => {
      try {
        console.log(`Attempting to fetch capsule with public_id: "${public_id}"`)
        setLoading(true)
        setError(null)
        
        const data = await getCapsuleByPublicId(public_id)
        console.log("Successfully fetched capsule data:", data)
        setCapsule(data)
      } catch (error) {
        console.error("Error fetching capsule:", error)
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
        setError(error.message || "Failed to load capsule")
      } finally {
        setLoading(false)
      }
    }

    fetchCapsule()
  }, [public_id])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0e14] to-[#111827] text-white">
        <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading time capsule...</p>
            <p className="text-slate-500 text-sm mt-2">ID: {public_id}</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !capsule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0e14] to-[#111827] text-white">
        <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
          <div className="relative mb-6">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 opacity-70 blur-lg"></div>
            <div className="relative rounded-full bg-slate-900 p-4 border border-blue-500/30">
              <Lock className="h-10 w-10 text-blue-300" />
            </div>
          </div>
          <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-400 via-blue-600 to-slate-800 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="mt-4 text-2xl font-semibold">Time Capsule Not Found</h2>
          <p className="mt-4 text-muted-foreground max-w-md text-slate-300">
            {error || "The time capsule you're looking for doesn't exist or may have been removed."}
          </p>
          <p className="mt-2 text-slate-500 text-sm">
            Searched for ID: {public_id}
          </p>
          <div className="flex gap-4 mt-8">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-slate-700 hover:opacity-90 transition-all duration-300"
            >
              <Link to="/">Return Home</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Link to="/capsules">View All Capsules</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Determine if capsule is unlocked
  const isUnlocked = new Date(capsule.unlock_at) <= new Date()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0e14] to-[#111827] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Button asChild variant="ghost" className="mb-8 hover:bg-slate-800/50 text-slate-300 hover:text-blue-300 transition-all duration-300">
            <Link to="/capsules" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all capsules
            </Link>
          </Button>

          {/* Main capsule card */}
          <Card className="border border-slate-700/30 shadow-2xl bg-slate-800/90 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700"></div>
            <CardHeader className="pt-8 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <CardTitle className="text-3xl bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
                  {capsule.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-blue-200 px-3 py-1.5 rounded-full bg-slate-700/50 border border-blue-500/30">
                  <Calendar className="h-4 w-4" />
                  {isUnlocked
                    ? `Unlocked on ${new Date(capsule.unlock_at).toLocaleDateString()}`
                    : `Unlocks on ${new Date(capsule.unlock_at).toLocaleDateString()}`}
                </div>
              </div>
              <p className="text-slate-300">By {capsule.name}</p>
            </CardHeader>
            <CardContent className="pb-8">
              {isUnlocked ? (
                <div className="prose max-w-none">
                  <div className="bg-slate-700/50 p-6 rounded-lg border border-blue-500/20 shadow-inner">
                    <p className="whitespace-pre-wrap text-slate-100 leading-relaxed text-base font-medium">
                      {capsule.message}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="relative mx-auto w-fit mb-6">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 opacity-70 blur-lg"></div>
                    <div className="relative rounded-full bg-slate-900 p-4 border border-blue-500/30">
                      <Lock className="h-10 w-10 text-blue-300" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-medium mb-3 text-slate-200">This Time Capsule is Locked</h2>
                  <p className="text-slate-400 max-w-md mx-auto">
                    This capsule will be unlocked on {new Date(capsule.unlock_at).toLocaleDateString()}. Come back then to
                    view its contents.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-blue-500/30">
              <Share2 className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-slate-300">Time Capsule ID: {capsule.public_id}</span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-slate-400 mb-2">Share this link to let others view this capsule:</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <ShareLinkButton capsuleId={capsule.public_id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}