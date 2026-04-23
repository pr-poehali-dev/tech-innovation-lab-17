import { useState, useEffect } from "react"
import func2url from "../../backend/func2url.json"

export interface User {
  id: number
  name: string
  email: string
}

const AUTH_EVENT = "mat_auth_changed"

function getStoredUser(): User | null {
  const saved = localStorage.getItem("mat_user")
  return saved ? JSON.parse(saved) : null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getStoredUser)

  useEffect(() => {
    const handleChange = () => setUser(getStoredUser())
    window.addEventListener(AUTH_EVENT, handleChange)
    window.addEventListener("storage", handleChange)
    return () => {
      window.removeEventListener(AUTH_EVENT, handleChange)
      window.removeEventListener("storage", handleChange)
    }
  }, [])

  const notify = () => window.dispatchEvent(new Event(AUTH_EVENT))

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
    notify()
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
    notify()
    return data.user
  }

  const logout = () => {
    localStorage.removeItem("mat_user")
    localStorage.removeItem("mat_token")
    setUser(null)
    notify()
  }

  return { user, login, register, logout }
}
