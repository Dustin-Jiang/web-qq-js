import { Component } from ".";

interface MenuItem {
  target: HTMLElement;
  action: (this: HTMLElement, ev: MouseEvent) => any;
}

export default class FlyoutMenu extends Component<HTMLElement> {
  menuItem: MenuItem[]
  target: HTMLElement

  constructor(
    menuItem: MenuItem[],
    opener: HTMLElement
  ) {
    let target = document.querySelector(".flyout") as HTMLElement
    super(target)

    this.target = target

    this.menuItem = menuItem

    opener.addEventListener("click", this.toggleMenu)

    for (let i of menuItem) {
      i.target.addEventListener("click", i.action)
    }
  }

  toggleMenu() {
    let menu = $("flyout")[0];
    if (menu.className == "closed") {
      menu.className = "close";
      let a = window.setTimeout(() => {
        $("flyout")[0].className = "";
      }, 10);
      window.addEventListener(
        "mousedown", 
        () => this.closeMenuListener(menu, event as Event)
      );
    } else {
      window.removeEventListener(
        "mousedown", 
        () => this.closeMenuListener(menu, event as Event)
        );
      menu.className = "close";
      let a = window.setTimeout(() => {
        $("flyout")[0].className = "closed";
      }, 233);
    }
  }

  closeMenuListener(menu : HTMLElement, event: Event) {
    for (let i = 0; i < menu.childNodes.length; i++) {
      if (event.target == menu.childNodes[i]) {
        return;
      } else {
        this.toggleMenu();
      }
    }
  }
}