import { useState } from "react"
import { X } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export function AuthModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (mode === "login") {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
      onSuccess()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>

        <div className="flex gap-6 mb-8 border-b border-gray-100">
          <button
            onClick={() => setMode("login")}
            className={`pb-3 text-sm font-medium transition-colors ${mode === "login" ? "border-b-2 border-foreground text-foreground" : "text-gray-400"}`}
          >
            Войти
          </button>
          <button
            onClick={() => setMode("register")}
            className={`pb-3 text-sm font-medium transition-colors ${mode === "register" ? "border-b-2 border-foreground text-foreground" : "text-gray-400"}`}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "register" && (
            <input
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-white py-3 text-sm tracking-wide hover:bg-foreground/80 transition-colors disabled:opacity-60"
          >
            {loading ? "..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  )
}
