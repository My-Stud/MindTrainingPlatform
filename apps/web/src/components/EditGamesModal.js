"use client"

import { useState } from "react"
import { Edit, X, Save } from "lucide-react"
import { useRouter } from "next/navigation"

export function EditGamesModal({ questionSet, allGames }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedGames, setSelectedGames] = useState(
    questionSet.games.map(g => g.id)
  )

  const handleGameToggle = (gameId) => {
    setSelectedGames(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/edit-set-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionSetId: questionSet.id,
          gameIds: selectedGames
        })
      })

      if (res.ok) {
        setIsOpen(false)
        router.refresh()
      } else {
        alert("Failed to update games")
      }
    } catch (err) {
      alert("Error updating games")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-emerald-500 hover:text-emerald-700 p-2 rounded-lg hover:bg-emerald-50 transition-colors mr-1"
        title="Edit Games"
      >
        <Edit className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">
                Assign Games for: {questionSet.name}
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <label className="block text-sm font-medium text-slate-700 mb-4">
                Select games this question set can be played on:
              </label>
              <div className="flex flex-wrap gap-3">
                {allGames.map(game => (
                  <label 
                    key={game.id} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                      selectedGames.includes(game.id) 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' 
                        : 'bg-white border-gray-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={selectedGames.includes(game.id)}
                      onChange={() => handleGameToggle(game.id)}
                    />
                    {game.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isLoading}
                className="bg-slate-900 text-white px-6 py-2 rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
