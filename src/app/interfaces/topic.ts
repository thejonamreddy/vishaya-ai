import { Audio } from "./audio"

interface SubTopic {
  id: string, 
  key: string,
  subTopic: string,
  description: string,
  selected: boolean
}

export interface Topic {
  id: string, 
  key: string,
  topic: string,
  description: string,
  subTopics: SubTopic[],
  selected: boolean,
  audios: Audio[]
}
