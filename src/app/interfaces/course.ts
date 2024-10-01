import { CourseLanguage } from "./course-language";

export interface Course {
  id: string,
  createdAt: string,
  updatedAt: string,
  title: string,
  description: string,
  targetAudience: string,
  learningObjectives: string,
  level: string,
  duration: string,
  status: string,
  /* Navigation Properties */
  languages: CourseLanguage[]
}