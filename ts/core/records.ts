import { Friend, Group, UserSelf } from "./user";
import User from "./user"
import { Message, TextMessage } from "./message/textMessage";
import { scrollToBottom } from "../views/utils";

export default class Records {
  content : Message[]
  fetcher : Function
  timestamp : string | undefined

  constructor(content : Message[], fetcher?: Function, index? : number) {
    this.content = content;
    if (fetcher instanceof Function) {
      this.fetcher = fetcher;
      this.fetcher.call(this, (data : any) => { // FIXME: The type of `data` should be a oicq object
        for (let i of data) {
          var nickname = new User(
            i.user_id == undefined ? i.sender.user_id : i.user_id,
            i.nickname == undefined ? i.sender.nickname : i.nickname
          );
          this.append(new TextMessage(nickname, i.raw_message, i.time));
        }
        this.timestamp = this.latest().timestamp;
        // Insert to a specific index of window.chat.
        // TODO: Seperate into a specific class for `window.chat`
        if (typeof index !== "undefined")
          $(".user-list")[0].innerHTML += (window as any).chat[index].list(index); // FIXME: Type of Windows object.
      });
    } else {
      this.fetcher = () => {}
    }
    this.timestamp = this.latest().timestamp;
  }
  show(element : HTMLDivElement) {
    let html = "";
    for (let i of this.content) {
      let direction =
        i["sender"] instanceof UserSelf ||
        i["sender"].toString() === "self" ||
        i["sender"] == (window as any).account.name ||
        i["sender"]["user_id"] == (window as any).account.id
          ? "right"
          : "left";
      html += `<message class="${direction}">
        ${
          i.sender.toString() == "self" ? "" : `<sender>${
            i.sender
          }</sender>`
        }
        <context>${i.content.replace("\r", "<br/>")}</context>
      </message>`;
    }
    element.innerHTML = html;
    scrollToBottom(element);
  }
  latest() : Message {
    let latest = this.content[this.content.length - 1];
    return latest;
  }
  append(content : Message | Message[]) {
    if (content instanceof TextMessage) {
      this.content.push(content);
      return this.content;
    } else // Check if `content` is an Array and append it.
    if (Array.isArray(content)) {
      for (let i of content) {
        this.content.push(i);
      }
      return this.content;
    }
  }
}
