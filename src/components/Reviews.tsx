import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { HighlightedText } from "./HighlightedText"
import { AuthModal } from "./AuthModal"
import { useAuth } from "../hooks/useAuth"
import func2url from "../../backend/func2url.json"

interface Review {
  id: number
  name: string
  text: string
  rating: number
  created_at: string
}

export function Reviews() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [showAuth, setShowAuth] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [text, setText] = useState("")
  const [rating, setRating] = useState(5)
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const loadReviews = async () => {
    const res = await fetch(func2url.reviews)
    const data = await res.json()
    setReviews(data.reviews || [])
  }

  useEffect(() => { loadReviews() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setStatus("loading")
    await fetch(func2url.reviews, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, text, rating }),
    })
    setStatus("success")
    setText("")
    setRating(5)
    setShowForm(false)
  }

  return (
    <section id="reviews" className="py-32 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Клиенты о нас</p>
            <h2 className="text-5xl font-medium leading-[1.15] tracking-tight lg:text-7xl">
              <HighlightedText>Отзывы</HighlightedText>
            </h2>
          </div>

          {status === "success" ? (
            <p className="text-sm text-muted-foreground">Отзыв отправлен на проверку — спасибо!</p>
          ) : user ? (
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 bg-foreground text-white px-6 py-3 text-sm hover:bg-foreground/80 transition-colors"
            >
              {showForm ? "Отмена" : "Оставить отзыв"}
            </button>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="inline-flex items-center gap-2 border border-foreground px-6 py-3 text-sm hover:bg-foreground hover:text-white transition-colors"
            >
              Войти, чтобы оставить отзыв
            </button>
          )}
        </div>

        {showForm && user && (
          <form onSubmit={handleSubmit} className="mb-12 max-w-lg bg-secondary/30 p-6 flex flex-col gap-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setRating(s)}>
                  <Star
                    className={`w-6 h-6 transition-colors ${s <= rating ? "fill-orange-400 text-orange-400" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Расскажите о вашем опыте работы с нами..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={4}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="self-start bg-foreground text-white px-6 py-3 text-sm hover:bg-foreground/80 transition-colors disabled:opacity-60"
            >
              {status === "loading" ? "Отправка..." : "Отправить"}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-lg">Пока отзывов нет. Будьте первым!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="border border-border p-6 flex flex-col gap-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "fill-orange-400 text-orange-400" : "text-gray-200"}`} />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed flex-1">{r.text}</p>
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("ru-RU")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowForm(true)} />
      )}
    </section>
  )
}
