import User from "../user"
import { Message } from "."

export default class ImageMessage extends Message {
  constructor(
    sender : User, 
    content : string, 
    timestamp? : string
  ) {
    super(sender, content, timestamp)
  }
  show() {
    return `<img src="${this.content}">`
  }
}