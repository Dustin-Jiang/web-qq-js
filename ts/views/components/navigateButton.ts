import { Component } from "./index"

/**
 * Draw Icon in the navigate button
 *
 * navigateButton(void) : void
 */
export default class NavigateButton extends Component<HTMLElement> {
  menu : string = `<svg><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>`;
  back : string = `<svg><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>`;
  
  constructor() {
    super(document.querySelector(".navigator") as HTMLElement)
    this.switch()
    this.target.addEventListener("click", this.onClick)
    this.target.addEventListener("hashchange", this.hashchange)
  }

  switch() {
    this.target.innerHTML = (location.hash == "") ? this.menu : this.back;
  }

  hashchange() {
    this.switch()
    if (location.hash.split("/")[1] === undefined) {
      this.hideChat();
    } else this.showChat();
  }

  onClick() {
    if (this.target.innerHTML == this.menu){
      return
    }
    if (this.target.innerHTML == this.back) {
      this.hideChat()
      this.switch()
    }
  }

  /**
   * Show chat list
   *
   * showChat(void) : void
   */
  showChat() {
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
  hideChat() {
    location.hash = "";
    $("panel")[0].style.setProperty("--display", "none");
    $("panel")[0].style.setProperty("--visibility", "hidden");
    $("side-panel")[0].style.setProperty("--display", "block");
    $("side-panel")[0].style.setProperty("--visibility", "unset");
    $("header-text")[0].innerHTML = "WebQQ";
  }
}
