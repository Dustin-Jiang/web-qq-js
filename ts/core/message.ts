import User from "./user"
export abstract class Message {
  sender : User
  content : string
  timestamp? : string
  constructor(sender : User, content : string, timestamp? : string) {
    this.sender = sender;
    this.content = content;
    this.timestamp = timestamp;
  }
  show() {
    return this.content
  }
}

export class TextMessage extends Message {
  constructor(sender : User, content : string, timestamp? : string) {
    super(sender, content, timestamp);
  }
}

export class ImageMessage extends Message {
  constructor(sender : User, content : string, timestamp? : string) {
    super(sender, content, timestamp)
  }
  show() {
    return `<img src="${this.content}">`
  }
}

export class AtMessage extends Message {
  target: User
  constructor(sender : User, content : string, target : User, timestamp? : string) {
    super(sender, content, timestamp)
    this.target = target
  }
}