import User from "../user"
import AtMessage from "./atMessage";
import ImageMessage from "./imageMessage";
import TextMessage from "./textMessage";

export abstract class Message {
  sender : User
  content : string
  timestamp? : string
  constructor(
    sender : User, 
    content : string, 
    timestamp? : string
  ) {
    this.sender = sender;
    this.content = content;
    this.timestamp = timestamp;
  }
  show() {
    return this.content
  }
}

export {
  TextMessage,
  AtMessage,
  ImageMessage
}