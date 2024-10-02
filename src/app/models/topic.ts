export interface TopicModel {
  id: string,
  title: string,
  description: string,
  selected: boolean,
  children: TopicModel[]
}