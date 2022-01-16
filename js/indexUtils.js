/**
 * Draw Icon in the navigate button
 * 
 * navigateButton(void) : void
 */
function navigateButton() {
  menu = `<svg><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>`;
  back = `<svg><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>`;
  $(".navigator")[0].innerHTML = (location.hash == "") ? menu : back;
}

/** 
 * Show chat list
 * 
 * showChat(void) : void
 */
function showChat() {
  index = location.hash.split("/")[1];
  if (index == undefined) return;
  isOpen = $("panel")[0].style.getPropertyValue("--display") == "block";
  if (!isOpen) {
    $("panel")[0].style.setProperty("--display", "block");
    $("panel")[0].style.setProperty("--visibility", "unset");
    $("side-panel")[0].style.setProperty("--display", "none");
    $("side-panel")[0].style.setProperty("--visibility", "hidden");
  }
  window.chat[index].records.show($(".message-container")[0]);
  location.hash = `chat/${index}`;
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
  menu = $("flyout")[0];
  if (menu.className == "closed") {
    menu.className = "close";
    a = window.setTimeout(() => { $("flyout")[0].className = ""; }, 10);
    window.addEventListener("mousedown", closeMenuListener);
  } else {
    window.removeEventListener("mousedown", closeMenuListener);
    menu.className = "close";
    a = window.setTimeout(() => { $("flyout")[0].className = "closed"; }, 233);
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
  if ($("textbar input")[0].value == "" || $("textbar input")[0].value == undefined) return;
  chatId = location.hash.split("/")[1];
  window.chat[chatId].send(new TextMessage("self", $("textbar input")[0].value));
  window.chat[index].records.show($(".message-container")[0]);

  $("textbar input")[0].value = "";
}

function scrollToBottom(obj) {
  obj.scrollTop = obj.scrollHeight;
}