import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 text-center bg-black">
      <div>
        <div className="relative mb-6 mx-auto w-fit">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-b from-[#2e4f80] via-[#8bc1f5] to-white opacity-70 blur-lg"></div>
          <div className="relative rounded-full bg-black p-4">
            <Search className="h-10 w-10 text-white" />
          </div>
        </div>

        <h1
          className="text-7xl font-bold bg-clip-text text-transparent leading-tight"
          style={{
            backgroundImage: `linear-gradient(
              to top,
              #2e4f80 0%,
              #5e9be3 20%,
              #8bc1f5 35%,
              #c8e5fc 50%,
              #eff7f6 65%,
              #ffffff 90%
            )`,
          }}
        >
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-white">
          Vault Not Found
        </h2>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto text-white/80">
          The vault you're looking for doesn't exist or may have been removed.
        </p>

        <Button
          asChild
          className="mt-8 text-white bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 bg-[length:200%_200%] hover:bg-right transition-all duration-500 ease-in-out rounded-md px-6 py-3 shadow-md"



        >
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
