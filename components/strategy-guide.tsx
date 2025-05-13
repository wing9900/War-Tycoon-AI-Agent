"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface StrategyStep {
  title: string
  content: string
}

interface StrategyGuideProps {
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  steps: StrategyStep[]
}

export function StrategyGuide({ title, description, difficulty, steps }: StrategyGuideProps) {
  return (
    <Card className="w-full border-zinc-700 bg-zinc-800 text-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-amber-400">{title}</CardTitle>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              difficulty === "Beginner"
                ? "bg-green-500/20 text-green-400"
                : difficulty === "Intermediate"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-red-500/20 text-red-400"
            }`}
          >
            {difficulty}
          </div>
        </div>
        <p className="text-zinc-300">{description}</p>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {steps.map((step, index) => (
            <AccordionItem key={index} value={`step-${index}`} className="border-zinc-700">
              <AccordionTrigger className="hover:text-amber-400">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  {step.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-zinc-300">{step.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
