import { useState } from "react"
import { Plus } from "lucide-react"

const faqs = [
  {
    question: "Сколько стоит дизайн-проект квартиры?",
    answer:
      "Стоимость зависит от площади и объёма работ. Дизайн-проект однокомнатной квартиры начинается от 80 000 ₽. На бесплатной консультации мы точно рассчитаем смету под вашу квартиру.",
  },
  {
    question: "Сколько времени занимает разработка дизайн-проекта?",
    answer:
      "Стандартный дизайн-проект для квартиры до 70 м² занимает 3–5 недель. Это включает замеры, концепцию, 3D-визуализацию и полный пакет рабочих чертежей. Сроки согласовываем заранее и строго соблюдаем.",
  },
  {
    question: "Можете ли вы работать с моим ремонтным бригадой?",
    answer:
      "Да, мы работаем с любыми бригадами. Если у вас уже есть строители — мы передаём им полный пакет чертежей и осуществляем авторский надзор. Также можем порекомендовать проверенных подрядчиков из нашей базы.",
  },
  {
    question: "Что входит в дизайн-проект?",
    answer:
      "Дизайн-проект включает: обмерный план, планировочные решения, 3D-визуализацию всех комнат, чертежи для строителей (электрика, сантехника, отделка), спецификацию материалов и мебели. Всё, что нужно для качественного ремонта.",
  },
  {
    question: "Работаете ли вы с квартирами в новостройках (без отделки)?",
    answer:
      "Да, это наш основной профиль. Квартира без отделки — идеальный старт: мы сразу проектируем всё с нуля, без компромиссов. Также работаем с вторичным жильём и капитальным ремонтом.",
  },
  {
    question: "Как начать работу с вами?",
    answer:
      "Напишите нам или позвоните — мы проведём бесплатную консультацию (онлайн или на объекте), обсудим ваши пожелания и бюджет, и предложим оптимальный план работы. Без обязательств.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Вопросы</p>
          <h2 className="text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-7xl">
            Частые вопросы
          </h2>
        </div>

        <div>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full py-6 flex items-start justify-between gap-6 text-left group"
              >
                <span className="text-lg font-medium text-foreground transition-colors group-hover:text-foreground/70">
                  {faq.question}
                </span>
                <Plus
                  className={`w-6 h-6 text-foreground flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : "rotate-0"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-muted-foreground leading-relaxed pb-6 pr-12">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}