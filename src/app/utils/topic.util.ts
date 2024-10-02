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

export function getAudioUrl(base64Wav: string) {
  const byteCharacters = atob(base64Wav); // Decode Base64 to binary string
  const byteNumbers = new Array(byteCharacters.length);

  // Convert binary string to byte array
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob); // Create Object URL from Blob

  return url
}