"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.json.stringify.js");

var _utils = require("./utils");

window.apiUrl = "http://localhost:5000";
$(document).ready(function () {
  if (localStorage.getItem("user") != "" && localStorage.getItem("user") != undefined) window.location = "/index.html";
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
  var id = $("input")[0].value;

  if (isNaN(id) || id == "") {
    $("input")[0].classList.add("error");
    return;
  }

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200 || xhr.status == 304) {
        setCredential(id, function () {
          return window.location = "/";
        });
      }

      if (xhr.status == 403) {
        location.hash = "continue/".concat(id);
        $(".QR img")[0].src = "".concat(window.apiUrl, "/login/qrcode/").concat(id);
      } else {
        $("input")[0].classList.add("error");
        return;
      }
    }
  };

  xhr.open("GET", "".concat(window.apiUrl, "/login/request/").concat(id));
  xhr.send();
}

function router() {
  (0, _utils.navigateButton)();
  var hash = location.hash;

  if (hash == "#" || hash == "") {
    $(".scan")[0].classList.add("hidden");
    $(".login")[0].classList.remove("hidden");
  } else {
    $(".login")[0].classList.add("hidden");
    $(".scan")[0].classList.remove("hidden");
  }
}

function setCredential(id, callback) {
  if (typeof callback != "function") return;
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200 || xhr.status == 304) {
        var nickname = xhr.responseText;
        var config = {
          id: id,
          name: nickname
        };
        localStorage.setItem("user", JSON.stringify(config));
        callback();
      }
    }
  };

  xhr.open("GET", "".concat(window.apiUrl, "/client/nickname/").concat(id));
  xhr.send();
}