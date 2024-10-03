import Link from "next/link"

interface Props {
  step: number,
  courseId: string
}

export function Stepper({ step, courseId }: Props) {
  const steps = [
    {
      name: "Course Initialization",
      url: `/courses/${courseId}/details`
    },
    {
      name: "Topic Generation & Refinement",
      url: `/courses/${courseId}/topics`
    },
    {
      name: "Content Generation",
      url: `/courses/${courseId}/contents`
    },
    {
      name: "Course Preview",
      url: `/courses/${courseId}/preview`
    }
  ]

  function isActive(index: number) {
    return step === (index + 1)
  }

  return (
    <div className="flex items-center gap-4 bg-white p-4 border rounded-md">
      {steps.map((s, i) => (
          <Link key={i} href={s.url}>
          <div className="flex items-center gap-4">
            <span className={`text-xs h-6 w-6 rounded-full border bg-muted flex items-center justify-center ${isActive(i) && 'bg-black text-white'}`}>{i + 1}</span>
            <p className={`text-sm ${isActive(i) ? 'font-semibold text-black' : 'text-muted-foreground'}`}>{s.name}</p>
            {(i < steps.length - 1) && <div className="h-[2px] w-[24px] bg-muted-foreground/40 rounded-md" />}
          </div>
        </Link>
      ))}
    </div>
  )
}