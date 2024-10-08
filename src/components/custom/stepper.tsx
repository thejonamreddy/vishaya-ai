import { Course } from "@/app/interfaces/course"
import Link from "next/link"

interface Props {
  step: number,
  course: Course
}

export function Stepper({ step, course }: Props) {
  const steps = [
    {
      name: "Course Initialization",
      url: `/courses/${course.id}/details`,
      status: ['draft', 'brainstorming', 'prototyping', 'ready']
    },
    {
      name: "Topic Generation & Refinement",
      url: `/courses/${course.id}/topics`,
      status: ['draft', 'brainstorming', 'prototyping', 'ready']
    },
    {
      name: "Content Generation",
      url: `/courses/${course.id}/contents`,
      status: ['brainstorming', 'prototyping', 'ready']
    },
    {
      name: "Course Preview",
      url: `/courses/${course.id}/preview`,
      status: ['prototyping', 'ready']
    }
  ]

  function isActive(index: number) {
    return step === (index + 1)
  }

  const filteredSteps = steps.filter((s) => s.status.includes(course.status))

  return (
    <div className="flex items-center gap-4 bg-white p-4 border rounded-md">
      {filteredSteps.map((s, i) => (
          <Link key={i} href={s.url}>
          <div className="flex items-center gap-4">
            <span className={`text-xs h-6 w-6 rounded-full border flex items-center justify-center ${isActive(i) ? 'bg-black text-white' : 'bg-muted'}`}>{i + 1}</span>
            <p className={`text-sm ${isActive(i) ? 'font-semibold text-black' : 'text-muted-foreground'}`}>{s.name}</p>
            {(i < filteredSteps.length - 1) && <div className="h-[2px] w-[24px] bg-muted-foreground/40 rounded-md" />}
          </div>
        </Link>
      ))}
    </div>
  )
}