"use client"

import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export function AdminLogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 transition-colors text-left"
    >
      <LogOut className="w-5 h-5" />
      <span>Sign Out</span>
    </button>
  )
}
