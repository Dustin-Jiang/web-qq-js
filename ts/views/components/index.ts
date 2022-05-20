import NavigateButton from "./navigateButton";
import FlyoutMenu from "./flyoutMenu";

export abstract class Component<T> {
  target: T
  constructor(target: T) {
    this.target = target
  }
}

export {
  NavigateButton,
  FlyoutMenu
}