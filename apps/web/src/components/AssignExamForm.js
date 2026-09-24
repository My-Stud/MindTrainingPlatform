"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

export function AssignExamForm({ questionSets }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.target)

    try {
      const res = await fetch("/api/admin/assign-exam", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to assign exam")
      } else {
        setSuccess("Successfully assigned exam!")
        e.target.reset()
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
          Error: {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="lg:col-span-1">
          <label htmlFor="questionSetId" className="block text-sm font-medium text-slate-700 mb-1">Question Set</label>
          <select name="questionSetId" id="questionSetId" required className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Select Set...</option>
            {questionSets.map(set => (
              <option key={set.id} value={set.id}>{set.name}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="targetType" className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
          <select name="targetType" id="targetType" required className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="user">Specific User</option>
            <option value="class">Entire Class</option>
          </select>
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="targetId" className="block text-sm font-medium text-slate-700 mb-1">User / Class</label>
          <input type="text" name="targetId" id="targetId" required placeholder="Email or Class Name" className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="scheduledFor" className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
          <input type="datetime-local" name="scheduledFor" id="scheduledFor" required className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <div className="lg:col-span-1">
          <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white px-6 py-2 rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 h-[42px] disabled:opacity-50">
            <Calendar className="w-4 h-4" />
            {isLoading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </form>
      <p className="text-xs text-slate-500 mt-3">
        * For 'Entire Class', type exactly as it appears (e.g. 'Class 10'). For 'Specific User', type their email or username.
      </p>
    </div>
  )
}
