window.apiUrl = "http://localhost:5000";

$(document).ready(function () {
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
  id = $("input")[0].value;
  if (isNaN(id) || id == "") {
    $("input")[0].classList.add("error");
    return;
  }
  xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200 || xhr.status == 304) {
        setCredential(id, () => window.location = "/")
      }
      if (xhr.status == 403) {
        location.hash = `continue/${id}`;
        $(".QR img")[0].src = `${window.apiUrl}/login/qrcode/${id}`;
      }
      else {
        $("input")[0].classList.add("error");
        return;
      }
    }
  }
  xhr.open("GET", `${window.apiUrl}/login/request/${id}`)
  xhr.send()
}

function router() {
  navigateButton();
  hash = location.hash;
  if (hash == "#" || hash == "") {
    $(".scan")[0].classList.add("hidden");
    $(".login")[0].classList.remove("hidden");
  } else {
    $(".login")[0].classList.add("hidden");
    $(".scan")[0].classList.remove("hidden");
  }
}

function navigateButton() {
  menu = `<svg><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>`;
  back = `<svg><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>`;
  $(".navigator")[0].innerHTML = (location.hash == "" || location.hash == "#") ? menu : back;
}

function setCredential(id, callback) {
  if (typeof(callback) != "function") return;

  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200 || xhr.status == 304) {
        nickname = xhr.responseText;
        config = {
          id: id,
          name: nickname
        }
        localStorage.setItem("user", JSON.stringify(config))
        callback()
      }
    }
  };
  xhr.open("GET", `${window.apiUrl}/client/nickname/${id}`);
  xhr.send()
}