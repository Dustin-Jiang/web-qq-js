import User from "../user"
import { Message } from "."

export default class AtMessage extends Message {
  target: User
  constructor(
    sender : User, 
    content : string, 
    target : User, 
    timestamp? : string
  ) {
    super(sender, content, timestamp)
    this.target = target
  }
}