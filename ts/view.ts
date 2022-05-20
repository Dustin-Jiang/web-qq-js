import Auth from "./auth"
import {
  appIndex,
  login
} from "./views"

let view

//Router
switch(window.location.pathname) {
  case ("/index.html"):
  case ("/"):
    if ((new Auth).check())
      window.location.assign("/login.html")
    view = new appIndex()
    break
  case ("/login.html"):
    view = new login()
    break
}