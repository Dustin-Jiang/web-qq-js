import { TextMessage } from "../core/message";
import { UserSelf } from "../core/user";

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
