import { TextMessage } from "../core/message";
import { UserSelf } from "../core/user";

/**
 * Draw Icon in the navigate button
 *
 * navigateButton(void) : void
 */
export function navigateButton() {
  let menu = `<svg><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>`;
  let back = `<svg><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>`;
  $(".navigator")[0].innerHTML = location.hash == "" ? menu : back;
}

/**
 * Show chat list
 *
 * showChat(void) : void
 */
export function showChat() {
  let index = location.hash.split("/")[1];
  if (index == undefined) return;
  let isOpen = $("panel")[0].style.getPropertyValue("--display") == "block";
  if (!isOpen) {
    $("panel")[0].style.setProperty("--display", "block");
    $("panel")[0].style.setProperty("--visibility", "unset");
    $("side-panel")[0].style.setProperty("--display", "none");
    $("side-panel")[0].style.setProperty("--visibility", "hidden");
  }
  (window as any).chat[index].records.show($(".message-container")[0]);
  location.hash = `chat/${index}`;
  $("header-text")[0].innerHTML = `<img src="${
    (window as any).chat[index].avator
  }">${(window as any).chat[index].name}`;
}

/**
 * Hide chat list
 *
 * hideChat(void) : void
 */
export function hideChat() {
  location.hash = "";
  $("panel")[0].style.setProperty("--display", "none");
  $("panel")[0].style.setProperty("--visibility", "hidden");
  $("side-panel")[0].style.setProperty("--display", "block");
  $("side-panel")[0].style.setProperty("--visibility", "unset");
  $("header-text")[0].innerHTML = "WebQQ";
}
export function toggleMenu() {
  let menu = $("flyout")[0];
  if (menu.className == "closed") {
    menu.className = "close";
    let a = window.setTimeout(() => {
      $("flyout")[0].className = "";
    }, 10);
    window.addEventListener("mousedown", () => closeMenuListener(menu, event as Event));
  } else {
    window.removeEventListener("mousedown", () => closeMenuListener(menu, event as Event));
    menu.className = "close";
    let a = window.setTimeout(() => {
      $("flyout")[0].className = "closed";
    }, 233);
  }
}

function closeMenuListener(menu : HTMLElement, event: Event) {
  for (let i = 0; i < menu.childNodes.length; i++) {
    if (event.target == menu.childNodes[i]) {
      return;
    } else {
      toggleMenu();
    }
  }
}

export function sendTextMsg() {
  if (
    ($("textbar input")[0] as HTMLInputElement).value == "" ||
    ($("textbar input")[0] as HTMLInputElement).value == undefined
  )
    return;
  let chatId = location.hash.split("/")[1];
  (window as any).chat[chatId].send(
    new TextMessage(
      new UserSelf(),
      ($("textbar input")[0] as HTMLInputElement).value
    )
  );
  let index = location.hash.split("/")[1];
  (window as any).chat[index].records.show($(".message-container")[0]);

  ($("textbar input")[0] as HTMLInputElement).value = "";
}

export function scrollToBottom(obj : HTMLElement) {
  obj.scrollTop = obj.scrollHeight;
}
