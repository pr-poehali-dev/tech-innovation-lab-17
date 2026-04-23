import { useState, useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "Лофт с тёмными акцентами",
    category: "55 м² · Студия",
    location: "Владивосток",
    year: "2026",
    image: "https://cdn.poehali.dev/files/e6459208-ea8a-4e7a-889d-7107e3481dd6.jpg",
  },
  {
    id: 2,
    title: "Индустриальный интерьер",
    category: "80 м² · Двухкомнатная",
    location: "Владивосток",
    year: "2026",
    image: "https://cdn.poehali.dev/files/7cd66fa0-364a-43de-8c2f-1def5f05e3ce.jpg",
  },
  {
    id: 3,
    title: "Квартира с кирпичной стеной",
    category: "70 м² · Двухкомнатная",
    location: "Владивосток",
    year: "2025",
    image: "https://cdn.poehali.dev/files/f9878d80-41ac-472e-86e5-e6b0c2a511fe.jpg",
  },
  {
    id: 4,
    title: "Светлая семейная квартира",
    category: "90 м² · Трёхкомнатная",
    location: "Владивосток",
    year: "2025",
    image: "https://cdn.poehali.dev/projects/5222242b-1f96-4301-89a1-3d7cf2808dfb/bucket/729859ba-da71-4148-88d1-216951c6828b.jpg",
  },
  {
    id: 5,
    title: "Роскошная ванная комната",
    category: "18 м² · Санузел",
    location: "Находка",
    year: "2025",
    image: "https://cdn.poehali.dev/files/ba04562d-c7be-402a-bbb9-802b1f2d2742.jpg",
  },
  {
    id: 6,
    title: "Гостиная с подсветкой",
    category: "45 м² · Гостиная",
    location: "Находка",
    year: "2026",
    image: "https://cdn.poehali.dev/files/b19b1fbe-a11c-434e-a2ee-22d273630ae5.jpg",
  },
  {
    id: 7,
    title: "Классическая гостиная",
    category: "60 м² · Двухкомнатная",
    location: "Артём",
    year: "2025",
    image: "https://cdn.poehali.dev/files/c6c02ba3-aee7-45d1-b306-61f464e1469a.jpg",
  },
  {
    id: 8,
    title: "Лофт с антресолью",
    category: "50 м² · Студия",
    location: "Артём",
    year: "2026",
    image: "https://cdn.poehali.dev/files/51c2b0b7-aa14-435e-887a-a924ccc2b2a1.jpg",
  },
  {
    id: 9,
    title: "Тёмно-синяя кухня",
    category: "25 м² · Кухня",
    location: "Большой Камень",
    year: "2026",
    image: "https://cdn.poehali.dev/projects/5222242b-1f96-4301-89a1-3d7cf2808dfb/bucket/d49d590a-3ae3-4317-b09a-87eee0bb6f9e.jpg",
  },
  {
    id: 10,
    title: "Кухня-студия в тёмных тонах",
    category: "40 м² · Студия",
    location: "Большой Камень",
    year: "2025",
    image: "https://cdn.poehali.dev/files/7381ae8c-51db-4f2f-9e02-b13f6ce75a58.jpg",
  },
]

export function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [revealedImages, setRevealedImages] = useState<Set<number>>(new Set())
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setRevealedImages((prev) => new Set(prev).add(projects[index].id))
            }
          }
        })
      },
      { threshold: 0.2 },
    )

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" className="py-32 md:py-29 bg-secondary/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Избранные работы</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">Наши проекты</h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            Смотреть все проекты
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div ref={(el) => (imageRefs.current[index] = el)} className="relative overflow-hidden aspect-[4/3] mb-6">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredId === project.id ? "scale-105" : "scale-100"
                  }`}
                />
                <div
                  className="absolute inset-0 bg-primary origin-top"
                  style={{
                    transform: revealedImages.has(project.id) ? "scaleY(0)" : "scaleY(1)",
                    transition: "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)",
                  }}
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-medium mb-2 group-hover:underline underline-offset-4">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {project.category} · {project.location}
                  </p>
                </div>
                <span className="text-muted-foreground/60 text-sm">{project.year}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}