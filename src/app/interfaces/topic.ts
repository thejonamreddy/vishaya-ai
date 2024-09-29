interface SubTopic {
  key: string,
  subTopic: string,
  description: string,
  /* Custom Properties */
  selected?: boolean,
  generated?: boolean
}

export interface Topic {
  key: string,
  topic: string,
  description: string,
  subTopics: SubTopic[],
  /* Custom Properties */
  selected?: boolean,
  generated?: boolean
}
