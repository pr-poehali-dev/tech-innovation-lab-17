import { useEffect, useState } from "react"
import { X, LogOut, Plus } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import func2url from "../../backend/func2url.json"

interface Order {
  id: number
  title: string
  description: string
  status: string
  status_label: string
  created_at: string
}

interface Props {
  onClose: () => void
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
}

export function UserCabinet({ onClose }: Props) {
  const { user, logout } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [showNewOrder, setShowNewOrder] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  const loadOrders = async () => {
    if (!user) return
    setLoading(true)
    const res = await fetch(`${func2url.orders}?user_id=${user.id}`)
    const data = await res.json()
    setOrders(data.orders || [])
    setLoading(false)
  }

  useEffect(() => { loadOrders() }, [])

  const handleNewOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSending(true)
    await fetch(func2url.orders, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, title, description }),
    })
    setTitle("")
    setDescription("")
    setShowNewOrder(false)
    setSending(false)
    loadOrders()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 backdrop-blur-sm">
      <div className="bg-white h-full w-full max-w-lg overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <p className="font-medium text-lg">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { logout(); onClose() }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Выйти"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-8 py-6 flex-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium">Мои заявки</h3>
            <button
              onClick={() => setShowNewOrder(!showNewOrder)}
              className="inline-flex items-center gap-1 text-sm bg-foreground text-white px-4 py-2 hover:bg-foreground/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Новая заявка
            </button>
          </div>

          {showNewOrder && (
            <form onSubmit={handleNewOrder} className="mb-6 p-5 bg-gray-50 flex flex-col gap-3">
              <input
                type="text"
                placeholder="Тема заявки (например: дизайн-проект 2-комнатной)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
              />
              <textarea
                placeholder="Дополнительная информация..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 resize-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="self-start bg-foreground text-white px-5 py-2 text-sm hover:bg-foreground/80 transition-colors disabled:opacity-60"
              >
                {sending ? "Отправка..." : "Отправить"}
              </button>
            </form>
          )}

          {loading ? (
            <p className="text-muted-foreground text-sm">Загрузка...</p>
          ) : orders.length === 0 ? (
            <p className="text-muted-foreground text-sm">У вас пока нет заявок. Создайте первую!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((o) => (
                <div key={o.id} className="border border-gray-100 p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-medium">{o.title}</p>
                    <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${STATUS_COLORS[o.status] || "bg-gray-100 text-gray-600"}`}>
                      {o.status_label}
                    </span>
                  </div>
                  {o.description && <p className="text-sm text-muted-foreground mb-2">{o.description}</p>}
                  <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("ru-RU")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
