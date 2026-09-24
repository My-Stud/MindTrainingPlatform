"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"

export function UploadForm({ games = [] }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedGames, setSelectedGames] = useState([])

  const handleGameToggle = (gameId) => {
    setSelectedGames(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.target)
    // Add selected games to formData
    formData.append("gameIds", JSON.stringify(selectedGames))

    try {
      const res = await fetch("/api/admin/upload-csv", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to upload question set")
      } else {
        setSuccess("Successfully uploaded question set!")
        e.target.reset()
        setSelectedGames([])
        router.refresh() // Refresh the page data
      }
    } catch (err) {
      setError("An unexpected error occurred during upload.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
          <strong>Success:</strong> {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Set Name</label>
            <input type="text" name="name" id="name" required placeholder="e.g., UPSC GK 2026" className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex-1">
            <label htmlFor="file" className="block text-sm font-medium text-slate-700 mb-1">CSV/TXT/DOCX File</label>
            <input type="file" name="file" id="file" accept=".csv,.txt,.docx" required className="w-full bg-slate-50 border border-gray-200 rounded-xl py-1.5 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-gray-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">Assign to Games (Optional)</label>
          <div className="flex flex-wrap gap-2">
            {games.length === 0 ? (
              <p className="text-sm text-slate-500">No games available.</p>
            ) : (
              games.map(game => (
                <label key={game.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors ${selectedGames.includes(game.id) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-slate-600 hover:bg-slate-50'}`}>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={selectedGames.includes(game.id)}
                    onChange={() => handleGameToggle(game.id)}
                  />
                  {game.name}
                </label>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <button type="submit" disabled={isLoading} className="bg-slate-900 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50">
            <Upload className="w-4 h-4" />
            {isLoading ? "Uploading..." : "Upload Set"}
          </button>
        </div>
      </form>
    </div>
  )
}
