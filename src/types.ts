/** One chat message as delivered by the API (see assets/msgs.json). */
export interface Message {
  id: string
  incoming: boolean
  from: string
  initials: string
  text: string
  /** "MM/DD/YY hh:mm AM" */
  created: string
}
