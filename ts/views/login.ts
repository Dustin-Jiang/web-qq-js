import { api } from "../api";
import Auth from "../auth";
import { NavigateButton } from "./components";

let id: number

export class Login {
  navigateButton = new NavigateButton()
  constructor() {
    jQuery(() => {
      if ((new Auth).check()) {
        (window as any).location = "/index.html"
      }
      this.router();
      $("#continue").on("click", this.login);
      $("button#login").on("click", this.loginCheck)
      window.addEventListener("keydown", (event) => {
        if (event.key === "Enter") this.login();
      });
      window.addEventListener("hashchange", this.router);
    })
  }

  login() {
    id = parseInt(($("input")[0] as HTMLFormElement).value);
    if (isNaN(id)) {
      $("input")[0].classList.add("error");
      return;
    }
    api.get(`${(window as any).apiUrl}/login/request/${id}`)
      .then((result) => {
        if (result.status == 200 || result.status == 304) {
          (new Auth).switch(id)
            .then(() => (window as any).location = "/")
        }
        if (result.status == 403) {
          location.hash = `continue/${id}`;
          ($(".QR img")[0] as HTMLImageElement).src = 
            api.generateUrl(
            `/login/qrcode/${id}?time=${(new Date()).getTime()}`
            )
        }
        else {
          $("input")[0].classList.add("error");
          return;
        }
      }
      )
  }

  loginCheck() {
    api.get(`/login/scan/${id}`).then((result) => {
      if (result.status === 200) {
        (new Auth).switch(id)
          .then(() => window.location.assign("/"))
      }
    },
      (result) => {
        ($(".QR img")[0] as HTMLImageElement).src =
          api.generateUrl(
            `/login/qrcode/${id}?time=${(new Date()).getTime()}`
            );
        alert("Please Rescan")
      })
  }

  router() {
    this.navigateButton.switch();
    let hash = location.hash;
    if (hash == "#" || hash == "") {
      $(".scan")[0].classList.add("hidden");
      $(".login")[0].classList.remove("hidden");
    } else {
      $(".login")[0].classList.add("hidden");
      $(".scan")[0].classList.remove("hidden");
    }
  }
}