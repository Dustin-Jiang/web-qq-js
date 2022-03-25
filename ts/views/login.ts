import { navigateButton } from "./utils";

(window as any).apiUrl = "http://localhost:5000";

$(document).ready(function () {
  if (localStorage.getItem("user") != "" && localStorage.getItem("user") != undefined) (window as any).location = "/index.html"
  router();
  $("#continue").click(login);
  window.addEventListener("keydown", function (event) {
    if (event.keyCode == 13) login();
  });
  window.addEventListener("hashchange", router);
  $(".navigator").click(function () {
    location.hash = "";
  });
});

function login() {
  let id = ($("input")[0] as HTMLFormElement).value;
  if (isNaN(id) || id == "") {
    $("input")[0].classList.add("error");
    return;
  }
  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200 || xhr.status == 304) {
        setCredential(id, () => (window as any).location = "/")
      }
      if (xhr.status == 403) {
        location.hash = `continue/${id}`;
        ($(".QR img")[0] as HTMLImageElement).src = `${(window as any).apiUrl}/login/qrcode/${id}`;
      }
      else {
        $("input")[0].classList.add("error");
        return;
      }
    }
  }
  xhr.open("GET", `${(window as any).apiUrl}/login/request/${id}`)
  xhr.send()
}

function router() {
  navigateButton();
  let hash = location.hash;
  if (hash == "#" || hash == "") {
    $(".scan")[0].classList.add("hidden");
    $(".login")[0].classList.remove("hidden");
  } else {
    $(".login")[0].classList.add("hidden");
    $(".scan")[0].classList.remove("hidden");
  }
}

function setCredential(id : number, callback : Function) {
  if (typeof(callback) != "function") return;

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200 || xhr.status == 304) {
        let nickname = xhr.responseText;
        let config = {
          id: id,
          name: nickname
        }
        localStorage.setItem("user", JSON.stringify(config))
        callback()
      }
    }
  };
  xhr.open("GET", `${(window as any).apiUrl}/client/nickname/${id}`);
  xhr.send()
}