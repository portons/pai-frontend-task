export interface ApiMessage {
  id: string;
  incoming: boolean;
  from: string;
  text: string;
  created: string;
}

export interface Message {
  id: string;
  incoming: boolean;
  from: string;
  text: string;
  created: Date;
}

export interface DayGroup {
  key: string;
  label: string;
  items: Message[];
}

export interface ChatMessageProps {
  item: Message;
}
