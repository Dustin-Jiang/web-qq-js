class User {
  constructor(user_id, nickname) {
    this.user_id = user_id
    this.nickname = nickname
  }
  toString () {
    return this.nickname
  }
}

class Client {
  constructor (content){
    this.update(content)

    var cache = localStorage.getItem("chat");
    if (cache != undefined && cache.getItem != "") {
      this.update(JSON.parse(cache))
    }
  }

  update(content) {
    for(var i in content) {
      if (i == "length") continue
      //Reform Objects from JSON
      if (!(content[i] instanceof Friend || content[i] instanceof Group)) {
        var chatList = []
        for (var j of content[i].records.content) {
          chatList.push(new TextMessage(new User(j.sender.user_id, j.sender.nickname), j.content, j.timestamp))
        }
        if (content[i].type == "Friend") content[i] = new Friend(content[i].id, content[i].name, new Records(chatList))
        if (content[i].type == "Group") content[i] = new Group(content[i].id, content[i].name, new Records(chatList))
      }
      this[i] = content[i]
      this.length = parseInt(i) + 1
    }
  }

  push(content) {
    this[this.length] = content
    this.length = this.length + 1
  }
}

class Friend {
  /**
   * 
   * @param {Number} id User QQ ID
   * @param {String} name User nickname
   * @param {Records[]} records An Array contains `Records` objects to contain chat records
   */
  constructor(id, name, records) {
    this.type = "Friend"
    this.name = name;
    this.id = id;
    this.avator = `http://q1.qlogo.cn/g?b=qq&s=640&nk=${id}`;
    this.records = records;
  }
  /**
   * 
   * @param {Number} index HTML `data-index` to get correct chat history
   * @returns 
   */
  list(index) {
    return `<div class="user" data-index="${index}">
      <avator><img src="${this.avator}"></avator>
      <div class="user-info">
        <name>${this.name}</name>
        <message>${this.records.latest().content}</message>
      </div>
    </div>`;
  }
  send(message) {
    $.ajax(`${window.apiUrl}/send/text/${window.account.id}/${this.type}/${this.id}/${message.content}`).done(function(data) {
      console.log(data)
    })

    return this.records.append(message);
  }
}
class Group extends Friend {
  constructor(id, name, records) {
    super(id, name, records);
    this.type = "Group"
    this.avator = `https://p.qlogo.cn/gh/${id}/${id}/640`;
  }
  list(index) {
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
class Records {
  constructor(content, fetcher, index) {
    this.content = content;
    if (fetcher instanceof Function) {
      this.fetcher = fetcher;
      this.fetcher.call(this, (data) => {
        for (i of data) {
          if (i == []) return;
          var nickname = new User(
            (i.user_id == undefined) ? i.sender.user_id : i.user_id,
            (i.nickname == undefined) ? i.sender.nickname : i.nickname
          );
          this.append(new TextMessage(nickname, i.raw_message, i.time));
        }
        this.timestamp = this.latest().timestamp;
        $(".user-list")[0].innerHTML += window.chat[index].list(index);
      });
    } else {
      this.fetcher = undefined;
    }
    this.timestamp = this.latest().timestamp;
  }
  show(element) {
    let html = "";
    for (let i of this.content) {
      let direction = 
      (i["sender"] == "self" || i["sender"] == window.account.name || i["sender"]["user_id"] == window.account.id)
       ? "right" : "left";
      html += `<message class="${direction}">
        ${(i.sender == "self") ? "" : `<sender>${i.sender}</sender>`}
        <context>${i.content.replace("\r", "<br/>")}</context>
      </message>`;
    }
    element.innerHTML = html;
    scrollToBottom(element);
  }
  latest() {
    var latest = this.content[this.content.length - 1];
    if (latest == undefined) latest = { "content": "", "sender": "" };
    return latest;
  }
  append(content) {
    if (content instanceof TextMessage) {
      this.content.push(content);
      return this.content;
    }
    else {
      for (i of content) {
        this.content.push(content);
      }
      return this.content;
    }
  }
}

function parseMessage(message) {
  result = []
  nickname = new User(
    (i.user_id == undefined) ? i.sender.user_id : i.user_id,
    (i.nickname == undefined) ? i.sender.nickname : i.nickname
  );
  for (i of message.message) {
    switch (message.message.type) {
      case "text":
        result.push(new TextMessage(nickname, i.text, message.time))
        break;
      case "image":
        result.push(new ImageMessage(nickname, i.url, message.time))
        break;
      case "at":
        result.push(new AtMessage(nickname, i.text, i.qq, message.time))
        break;
    }
  }
}

class Message {
  constructor(sender, content, timestamp) {
    this.sender = sender;
    this.content = content;
    this.timestamp = timestamp;
  }
  show() {
    return this.content
  }
}

class TextMessage extends Message {
  constructor(sender, content, timestamp) {
    super();
  }
}

class ImageMessage extends Message {
  constructor(sender, content, timestamp) {
    super()
  }
  show() {
    return `<img src="${this.content}">`
  }
}

class AtMessage extends Message {
  constructor(sender, content, target, timestamp) {
    super(sender, content, timestamp)
    this.target = target
  }
}