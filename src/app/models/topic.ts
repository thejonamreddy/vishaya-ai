export interface TopicModel {
  title: string,
  description: string,
  selected: boolean,
  children: TopicModel[]
}