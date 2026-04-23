import { useState, useEffect } from "react"
import func2url from "../../backend/func2url.json"

export interface User {
  id: number
  name: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("mat_user")
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch(func2url.auth, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    localStorage.setItem("mat_user", JSON.stringify(data.user))
    localStorage.setItem("mat_token", data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(func2url.auth, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "register", name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    localStorage.setItem("mat_user", JSON.stringify(data.user))
    localStorage.setItem("mat_token", data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem("mat_user")
    localStorage.removeItem("mat_token")
    setUser(null)
  }

  return { user, login, register, logout }
}
