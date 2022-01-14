class Friend {
  /**
   * 
   * @param {Number} id User QQ ID
   * @param {String} name User nickname
   * @param {Records[]} records An Array contains `Records` objects to contain chat records
   */
  constructor(id, name, records) {
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
    return this.records.append(message)
  }
}
class Group extends Friend {
  constructor(id, name, records) {
    super(id, name, records);
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
  constructor(content, fetcher, timestamp) {
    this.content = content;
    (typeof (fetcher) === "function") ? this.fetcher = fetcher : this.fetcher = undefined;
    this.timestamp = timestamp;
  }
  show(element) {
    let html = "";
    for (let i of this.content) {
      let direction = (i["sender"] == "self") ? "right" : "left";
      html += `<message class="${direction}">
        ${(i.sender == "self") ? "" : `<sender>${i.sender}</sender>`}
        <context>${i.content}</context>
      </message>`;
    }
    element.innerHTML = html
    scrollToBottom(element);
  }
  latest() {
    return this.content[this.content.length - 1];
  }
  append(content) {
    this.content.push(content)
  }
}

window.account = JSON.parse(localStorage.getItem("user"));
window.chat = [
  new Friend(2752805684, "Siunaus", new Records([
    new TextMessage("self", "WebQQ写嘛"),
    new TextMessage("Siunaus", "开始了"),
    new TextMessage("self", "WebQQ写好了嘛")
  ])),
  new Group(id = 872957249, name = "Minecraft小服务器", new Records([
    new TextMessage("self", "WebQQ写嘛"),
    new TextMessage("Siunaus", "开始了"),
    new TextMessage("Harry", "WebQQ写好了嘛")
  ]))
];


/**
 * Main Entry Point
 */
$(document).ready(function () {
  if (localStorage.getItem("user") == "" || localStorage.getItem("user") == undefined) window.location = "/login.html"
  navigateButton()
  window.addEventListener("hashchange", () => {
    navigateButton();
    if (location.hash.split("/")[1] === undefined) {
      hideChat();
    }
    else showChat();
  })
  $(".navigator").click(hideChat)

  //Display ID
  $(".account-name")[0].innerHTML = window.account.name;
  $(".account-id")[0].innerHTML = window.account.id;

  //Display Users
  for (i of $(".avator img")) i.src = `http://q1.qlogo.cn/g?b=qq&s=640&nk=${window.account.id}`;
  for (i in window.chat) $(".user-list")[0].innerHTML += window.chat[i].list(i);
  showChat()

  //Display Chat List
  $(".user-list").delegate(".user", "click", function (event) {
    index = event.currentTarget.dataset.index;
    location.hash = `chat/${index}`;
    showChat();
  })

  //Display flyout menu
  $(".IconButton.avator").click(toggleMenu);

  //Handle Send Message
  $(".SendButton").click(sendTextMsg)
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey) {
      console.log("Ctrl")
    }
    else {
      if (event.keyCode == 13) {
        sendTextMsg()
      }
    }
  })
});

/**
 * Draw Icon in the navigate button
 * 
 * navigateButton(void) : void
 */
function navigateButton() {
  menu = `<svg><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>`
  back = `<svg><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>`
  $(".navigator")[0].innerHTML = (location.hash == "") ? menu : back;
}

/** 
 * Show chat list
 * 
 * showChat(void) : void
 */
function showChat() {
  index = location.hash.split("/")[1]
  if (index == undefined) return;
  isOpen = $("panel")[0].style.getPropertyValue("--display") == "block"
  if (!isOpen) {
    $("panel")[0].style.setProperty("--display", "block");
    $("panel")[0].style.setProperty("--visibility", "unset");
    $("side-panel")[0].style.setProperty("--display", "none");
    $("side-panel")[0].style.setProperty("--visibility", "hidden");
  }
  window.chat[index].records.show($(".message-container")[0])
  location.hash = `chat/${index}`
  $("header-text")[0].innerHTML = `<img src="${window.chat[index].avator}">${window.chat[index].name}`;
}

/**
 * Hide chat list
 * 
 * hideChat(void) : void
 */
function hideChat() {
  location.hash = "";
  $("panel")[0].style.setProperty("--display", "none");
  $("panel")[0].style.setProperty("--visibility", "hidden");
  $("side-panel")[0].style.setProperty("--display", "block");
  $("side-panel")[0].style.setProperty("--visibility", "unset");
  $("header-text")[0].innerHTML = "WebQQ";
}
function toggleMenu() {
  menu = $("flyout")[0]
  if (menu.className == "closed") {
    menu.className = "close";
    a = window.setTimeout(() => { $("flyout")[0].className = ""; }, 10)
    window.addEventListener("mousedown", closeMenuListener)
  } else {
    window.removeEventListener("mousedown", closeMenuListener);
    menu.className = "close";
    a = window.setTimeout(() => { $("flyout")[0].className = "closed" }, 233)
  }
}

function closeMenuListener(event) {
  for (i of menu.childNodes) {
    if (event.target == i) {
      return;
    }
    else {
      toggleMenu();
    }
  }
};

function sendTextMsg() {
  chatId = location.hash.split("/")[1]
  window.chat[chatId].send(new TextMessage("self", $("textbar input")[0].value))
  window.chat[index].records.show($(".message-container")[0])

  $("textbar input")[0].value = ""
}

function scrollToBottom(obj) {
  obj.scrollTop = obj.scrollHeight;
}