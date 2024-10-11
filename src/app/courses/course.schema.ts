import { z } from "zod";
import { durations, levels, targetAudiences } from "@/app/utils/util";

export const CourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  targetAudience: z.enum(targetAudiences as [string, ...string[]]),
  learningObjectives: z.string(),
  level: z.enum(levels as [string, ...string[]]),
  duration: z.enum(durations as [string, ...string[]]),
  languages: z.array(z.object({
    languageId: z.string()
  })).min(1)
})