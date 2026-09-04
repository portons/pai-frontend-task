/** One chat message, as the app uses it (parsed from assets/msgs.json). */
export interface Message {
  id: string
  incoming: boolean
  from: string
  text: string
  created: Date
}
