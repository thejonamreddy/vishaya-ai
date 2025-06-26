import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Language } from "@/app/interfaces/language";
import { CourseLanguage } from "@/app/interfaces/course-language";
import { Info } from "lucide-react";

interface LanguageBadgesProps {
  languages: Language[]
  courseLanguages: CourseLanguage[]
}

export function LanguageBadges({ languages, courseLanguages }: LanguageBadgesProps) {
  const count = courseLanguages.length

  if (count === 0) {
    return null
  }

  const firstLang = courseLanguages[0]
  const rest = courseLanguages.slice(1)

  if (rest.length === 0) {
    return <Badge>{getLanguageName(firstLang.languageId)}</Badge>
  }

  function getLanguageName(languageId: string) {
    return languages.find((l) => l.id === languageId)?.name
  }

  return (
    <div className="flex gap-2 items-center">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex items-center gap-1 cursor-pointer">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{courseLanguages.length} languages</span>
          </div>
        </HoverCardTrigger>
        <HoverCardContent side="top" align="start" className="max-w-xs">
          <div className="flex gap-2 flex-wrap">
            {courseLanguages.map(({ languageId }, idx) => {
              return (
                <Badge key={idx} variant="secondary">
                  {getLanguageName(languageId)}
                </Badge>
              );
            })}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
