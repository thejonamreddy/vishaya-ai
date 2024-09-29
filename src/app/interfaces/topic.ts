interface SubTopic {
  key: string,
  subTopic: string,
  description: string,
  selected: boolean
}

export interface Topic {
  key: string,
  topic: string,
  description: string,
  subTopics: SubTopic[],
  selected: boolean
}
