import {
  appIndex,
  login
} from "./views/index"

let view

//Router
switch(window.location.pathname) {
  case ("/index.html"):
  case ("/"):
    view = new appIndex()
    break
  case ("/login.html"):
    view = new login()
    break
}