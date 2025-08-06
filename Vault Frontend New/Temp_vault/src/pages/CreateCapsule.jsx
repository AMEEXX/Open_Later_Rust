import React from "react"
import { CreateCapsuleForm } from "@/components/CreateCapsuleForm"

export default function CreateCapsule() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1
  className="text-4xl font-bold mb-10 text-center bg-clip-text text-transparent drop-shadow-md"
  style={{
    backgroundImage: `linear-gradient(
      to top,
      #2e4f80 0%,
      #5e9be3 20%,
      #8bc1f5 35%,
      #c8e5fc 50%,
      #eff7f6 65%,
      #ffffff 90%
    )`
  }}
>
  Create a Vault
</h1>

        <CreateCapsuleForm />
      </div>
    </div>
  )
}
