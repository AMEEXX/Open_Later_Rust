import React, { useState, useEffect } from "react"
import { useParams, Link, useLocation } from "react-router-dom"
import { ArrowLeft, Lock, Calendar, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShareLinkButton } from "@/components/ShareLinkButton"
import { getCapsuleByPublicId } from "@/lib/api"

export default function CapsuleDetail() {
  const params = useParams()
  const location = useLocation()
  const [capsule, setCapsule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState({})

  // Debug logging
  console.log("🔍 CapsuleDetail Component Rendered")
  console.log("📍 Location:", location)
  console.log("📊 Params:", params)
  console.log("🆔 Available param keys:", Object.keys(params))

  // Try to get the ID from different possible parameter names
  const capsuleId = params.public_id || params.id || params.publicId
  
  console.log("🎯 Extracted capsuleId:", capsuleId)

  useEffect(() => {
    console.log("🚀 useEffect triggered")
    console.log("🔍 Current capsuleId:", capsuleId)
    console.log("📍 Full location:", window.location.href)
    console.log("📊 All params:", params)
    
    setDebugInfo({
      url: window.location.href,
      pathname: location.pathname,
      params: params,
      paramKeys: Object.keys(params),
      extractedId: capsuleId
    })
    
    if (!capsuleId) {
      console.error("❌ No capsule ID found in params")
      console.log("Available params:", params)
      setError("No capsule ID provided in URL parameters")
      setLoading(false)
      return
    }

    const fetchCapsule = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("🔄 Fetching capsule with ID:", capsuleId)
        
        const data = await getCapsuleByPublicId(capsuleId)
        console.log("✅ Successfully fetched capsule:", data)
        
        setCapsule(data)
      } catch (error) {
        console.error("❌ Error fetching capsule:", error)
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config
        })
        
        setError(error.message || "Failed to load capsule")
      } finally {
        setLoading(false)
      }
    }

    fetchCapsule()
  }, [capsuleId, params, location.pathname])

  // Show debug info in development
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0e14] to-[#111827] text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-yellow-400">🐛 Debug Mode - CapsuleDetail</h1>
          
          <div className="bg-slate-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Debug Information</h2>
            <pre className="text-sm text-green-400 whitespace-pre-wrap overflow-auto">
              {JSON.stringify({
                url: window.location.href,
                pathname: location.pathname,
                params: params,
                paramKeys: Object.keys(params),
                extractedId: capsuleId,
                loading: loading,
                error: error,
                hasCapsule: !!capsule
              }, null, 2)}
            </pre>
          </div>

          {loading && (
            <div className="bg-blue-900/20 border border-blue-500 p-4 rounded-lg mb-4">
              <p className="text-blue-300">🔄 Loading capsule...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500 p-4 rounded-lg mb-4">
              <p className="text-red-300">❌ Error: {error}</p>
            </div>
          )}

          {capsule && (
            <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg mb-4">
              <p className="text-green-300">✅ Capsule loaded successfully!</p>
              <pre className="text-xs text-gray-300 mt-2">
                {JSON.stringify(capsule, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-purple-400">Quick Actions</h3>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link to="/">Home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/capsules">All Capsules</Link>
              </Button>
            </div>
          </div>

          {/* Normal component render when not in debug mode */}
          {capsule && !loading && !error && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Normal Component Render</h3>
              <Card className="border border-slate-700/30 shadow-2xl bg-slate-800/90 backdrop-blur-sm rounded-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700"></div>
                <CardHeader className="pt-8 pb-4">
                  <CardTitle className="text-2xl text-white">
                    {capsule.title}
                  </CardTitle>
                  <p className="text-slate-300">By {capsule.name}</p>
                </CardHeader>
                <CardContent className="pb-8">
                  <div className="bg-slate-700/50 p-6 rounded-lg border border-blue-500/20 shadow-inner">
                    <p className="text-slate-100 leading-relaxed text-base">
                      {capsule.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Production render (this won't show until we fix the debug issues)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0e14] to-[#111827] text-white">
        <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading time capsule...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !capsule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0e14] to-[#111827] text-white">
        <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Error Loading Capsule</h1>
          <p className="text-slate-300 mb-8">{error}</p>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/capsules">View All Capsules</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const isUnlocked = new Date(capsule.unlock_at) <= new Date()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0e14] to-[#111827] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Button asChild variant="ghost" className="mb-8 hover:bg-slate-800/50 text-slate-300 hover:text-blue-300 transition-all duration-300">
            <Link to="/capsules" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all capsules
            </Link>
          </Button>

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