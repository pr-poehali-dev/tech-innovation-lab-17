import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./HighlightedText"

const philosophyItems = [
  {
    title: "Слушаем и понимаем",
    description:
      "Каждая квартира уникальна, как и её хозяин. Мы начинаем с глубокого погружения в ваш образ жизни, вкусы и мечты — чтобы результат был именно вашим.",
  },
  {
    title: "Функция и красота вместе",
    description:
      "Красивый интерьер должен быть удобным. Мы проектируем пространства, где каждый сантиметр работает на вас, а эстетика не приносится в жертву практичности.",
  },
  {
    title: "Честные материалы",
    description:
      "Подбираем только проверенные материалы и поставщиков. Никаких скрытых наценок — только честные рекомендации и долговечное качество.",
  },
  {
    title: "Проект под ключ",
    description: "От первого эскиза до последнего гвоздя. Берём на себя весь процесс: дизайн, контроль ремонта, закупка мебели и декора.",
  },
]

export function Philosophy() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"))
          if (entry.isIntersecting) {
            setVisibleItems((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.3 },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="py-32 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column - Title and image */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Наша философия</p>
            <h2 className="text-6xl md:text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-8xl">
              Интерьер с
              <br />
              <HighlightedText>душой</HighlightedText>
            </h2>

            <div className="relative hidden lg:block mt-10">
              <div className="flex items-center gap-5">
                <img
                  src="https://cdn.poehali.dev/files/fed0933e-9d2c-4338-a13c-07000542f1d1.JPG"
                  alt="Сухоруков Матвей Сергеевич"
                  className="w-20 h-20 object-cover object-top rounded-full border-2 border-border"
                />
                <div>
                  <p className="font-semibold text-foreground text-lg leading-tight">Сухоруков Матвей Сергеевич</p>
                  <p className="text-muted-foreground text-sm mt-1">Директор · Дизайнер интерьеров</p>
                  <p className="text-muted-foreground text-sm">Студент 3 курса ВВГУ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Description and Philosophy items */}
          <div className="space-y-6 lg:pt-48">
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-12">
              Дизайн квартиры — это не просто красивые картинки. Это то, как вы будете чувствовать себя дома каждый день. Мы создаём пространства, в которые хочется возвращаться.
            </p>

            {philosophyItems.map((item, index) => (
              <div
                key={item.title}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                data-index={index}
                className={`transition-all duration-700 ${
                  visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-6">
                  <span className="text-muted-foreground/50 text-sm font-medium">0{index + 1}</span>
                  <div>
                    <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}