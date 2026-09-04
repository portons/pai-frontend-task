/** One chat message as delivered by the API (assets/msgs.json). */
export interface ApiMessage {
  id: string;
  incoming: boolean;
  from: string;
  text: string;
  /** "MM/DD/YY hh:mm AM" */
  created: string;
}

/** One chat message as the app uses it. */
export interface Message {
  id: string;
  incoming: boolean;
  from: string;
  text: string;
  created: Date;
}

/** The messages of one calendar day, in order. */
export interface DayGroup {
  /** Stable identity for the day, for keys. */
  key: string;
  /** The day as shown to the reader. */
  label: string;
  items: Message[];
}

/** Props of <ChatMessage>. */
export interface ChatMessageProps {
  item: Message;
}
