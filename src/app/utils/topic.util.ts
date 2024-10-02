import { Topic } from "../interfaces/topic"
import { TopicModel } from "../models/topic"

export function listToTree(data: Topic[]): TopicModel[] {
  const map: { [id: string]: TopicModel } = {}
  const tree = [] as TopicModel[]

  data.forEach(({ id, title, description, selected }) => {
    map[id] = { id, title, description, selected, children: [] }
  })

  data.forEach(item => {
    if (item.parentId) {
      map[item.parentId].children.push(map[item.id])
    } else {
      tree.push(map[item.id])
    }
  })

  return tree
}