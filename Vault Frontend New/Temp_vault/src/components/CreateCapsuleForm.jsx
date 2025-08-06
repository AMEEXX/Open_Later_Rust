import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CalendarIcon, Send, Clock } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { createCapsule } from "@/lib/api"

export function CreateCapsuleForm() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  const [calendarOpen, setCalendarOpen] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name")
    const email = formData.get("email")
    const title = formData.get("title")
    const message = formData.get("message")

    if (!date) {
      alert("Please select an unlock date")
      setIsSubmitting(false)
      return
    }

    try {
      const result = await createCapsule({
        name,
        email,
        title,
        message,
        unlock_at: date.toISOString(),
      })

      alert("Time Capsule Created Successfully!")
      navigate(`/capsule/${result.public_id}`)
    } catch (error) {
      console.error("Error creating capsule:", error)
      alert("Failed to create time capsule. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDateSelect = (selectedDate) => {
    console.log("Date selected:", selectedDate)
    setDate(selectedDate)
    setCalendarOpen(false)
  }

  const handleCalendarClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Calendar button clicked, current state:", calendarOpen)
    setCalendarOpen(!calendarOpen)
  }

  return (
    <Card className="border-0 shadow-lg bg-black/20 dark:bg-white/5 backdrop-blur-md rounded-xl overflow-hidden text-white">
      <div className="h-2 bg-gradient-to-r from-[#2e4f80] via-[#5e9be3] to-[#c8e5fc]"></div>
      <CardContent className="pt-8 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base text-white">
              Your Name
            </Label>
            <Input
              id="name"
              name="name"
              required
              className="h-12 bg-transparent border-2 border-gray-600 text-white placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-cyan-500 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base text-white">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="h-12 bg-transparent border-2 border-gray-600 text-white placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-cyan-500 transition-all duration-300"
            />
            <p className="text-xs text-gray-400">
              Your email will not be displayed publicly. It's only used for reference.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-base text-white">
              Vault Title
            </Label>
            <Input
              id="title"
              name="title"
              required
              className="h-12 bg-transparent border-2 border-gray-600 text-white placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-cyan-500 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-base text-white">
              Your Message
            </Label>
            <Textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Write your message for the future..."
              required
              className="bg-transparent border-2 border-gray-600 text-white placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-cyan-500 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base text-white">Unlock Date</Label>
            
            {/* Debug info */}
            <div className="text-xs text-gray-500 mb-2">
              Calendar Open: {calendarOpen ? 'true' : 'false'}
            </div>
            
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  onClick={handleCalendarClick}
                  className={cn(
                    "w-full h-12 flex items-center justify-start text-left font-normal bg-transparent border-2 border-gray-600 text-white hover:bg-white/10 transition-all duration-300 px-3 rounded-md",
                    !date && "text-gray-400",
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0 bg-slate-900 border-slate-600" 
                align="start"
                side="bottom"
                sideOffset={5}
              >
                <div className="p-3">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="rounded-md"
                  />
                </div>
              </PopoverContent>
            </Popover>
            
            <p className="text-xs text-gray-400">
              Select when your time capsule should be unlocked and visible to everyone.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-white font-semibold transition-all duration-300 mt-4 gap-2 transform hover:scale-105 active:scale-95 focus:outline-none 
            bg-gradient-to-r from-[#2e4f80] via-[#5e9be3] to-[#8bc1f5] 
            hover:opacity-95"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Clock className="h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Create Time Capsule
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}