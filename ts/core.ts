import { Message, TextMessage } from "./core/message";
import Records from "./core/records";
import User, { Contact, Friend, Group } from "./core/user"

export default class Client {
  [index: number] : Contact
  length : number
  constructor(content: any[]) {
    this.length = this.update(content);

    let cache = localStorage.getItem("chat");
    if (cache != undefined && cache != "") {
      this.length = this.update(JSON.parse(cache));
    }
  }

  update(content: Contact[]) : number {
    for (let i in content) {
      if (i == "length") continue;
      //Reform Objects from JSON
      if (!(content[i] instanceof Friend || content[i] instanceof Group)) {
        let chatList : Message[] = [];
        for (let j of content[i].records.content) {
          chatList.push(
            new TextMessage(
              new User(j.sender.user_id, j.sender.nickname),
              j.content,
              j.timestamp
            )
          );
        }
        if (content[i].type == "Friend")
          content[i] = new Friend(
            content[i].id,
            content[i].name,
            new Records(chatList)
          );
        if (content[i].type == "Group")
          content[i] = new Group(
            content[i].id,
            content[i].name,
            new Records(chatList)
          );
      }
      this[i] = content[i];
      this.length = parseInt(i) + 1;
    }
    return this.length
  }

  push(content : Contact) {
    this[this.length] = content;
    this.length = this.length + 1;
  }
}
