import { Message } from "./message";
import Records from "./records";

export default class User {
  user_id: number;
  nickname: string;
  constructor(user_id: number, nickname: string) {
    this.user_id = user_id;
    this.nickname = nickname;
  }
  toString() {
    return this.nickname;
  }
}

export class UserSelf extends User {
  constructor() {
    super((window as any).account.id, (window as any).account.name)
  }

  // To capable with message "self" tag.
  toString() : string {
    return "self"
  }
}

type URL = string;

export abstract class Contact {
  type: string;
  name: string;
  id: number;
  avator: URL;
  records: Records;

  constructor(
    id: number,
    type: "Friend" | "Group",
    name: string,
    avator: URL,
    records: Records
  ) {
    this.type = type;
    this.name = name;
    this.id = id;
    this.avator = avator;
    this.records = records;
  }
}

export class Friend extends Contact{
  /**
   *
   * @param {Number} id User QQ ID
   * @param {String} name User nickname
   * @param {Records} records An Array contains `Records` objects to contain chat records
   */
  constructor(id: number, name: string, records: Records) {
    super(
      id,
      "Friend",
      name,
      `http://q1.qlogo.cn/g?b=qq&s=640&nk=${id}`,
      records
    );
  }
  /**
   *
   * @param {Number} index HTML `data-index` to get correct chat history
   * @returns
   */
  list(index: number) {
    return `<div class="user" data-index="${index}">
      <avator><img src="${this.avator}"></avator>
      <div class="user-info">
        <name>${this.name}</name>
        <message>${this.records.latest().content}</message>
      </div>
    </div>`;
  }
  send(message: Message) {
    $.ajax(
      `${(window as any).apiUrl}/send/text/${(window as any).account.id}/${
        this.type
      }/${this.id}/${message.content}`
    ).done(function (data) {
      console.log(data);
    });

    return this.records.append(message);
  }
}

export class Group extends Contact {
  constructor(id : number, name : string, records : Records) {
    super(id, "Group", `https://p.qlogo.cn/gh/${id}/${id}/640`, name, records);
  }
  list(index : number) {
    return `<div class="user" data-index="${index}">
      <avator><img src="${this.avator}"></avator>
      <div class="user-info">
        <group>${this.name}</group>
        <name>${this.records.latest().sender}</name>
        <message>${this.records.latest().content}</message>
      </div>
    </div>`;
  }
}
