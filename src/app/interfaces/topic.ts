export interface Topic {
  id: string, 
  createdAt: string,
  updatedAt: string,
  title: string,
  description: string,
  selected: boolean,
  courseId: string,
  parentId: string
}
