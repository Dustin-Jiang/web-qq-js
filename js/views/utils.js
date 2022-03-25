"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hideChat = hideChat;
exports.navigateButton = navigateButton;
exports.scrollToBottom = scrollToBottom;
exports.sendTextMsg = sendTextMsg;
exports.showChat = showChat;
exports.toggleMenu = toggleMenu;

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/web.timers.js");

var _message = require("../core/message");

var _user = require("../core/user");

/**
 * Draw Icon in the navigate button
 *
 * navigateButton(void) : void
 */
function navigateButton() {
  var menu = "<svg><path d=\"M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z\"></path></svg>";
  var back = "<svg><path d=\"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z\"></path></svg>";
  $(".navigator")[0].innerHTML = location.hash == "" ? menu : back;
}
/**
 * Show chat list
 *
 * showChat(void) : void
 */


function showChat() {
  var index = location.hash.split("/")[1];
  if (index == undefined) return;
  var isOpen = $("panel")[0].style.getPropertyValue("--display") == "block";

  if (!isOpen) {
    $("panel")[0].style.setProperty("--display", "block");
    $("panel")[0].style.setProperty("--visibility", "unset");
    $("side-panel")[0].style.setProperty("--display", "none");
    $("side-panel")[0].style.setProperty("--visibility", "hidden");
  }

  window.chat[index].records.show($(".message-container")[0]);
  location.hash = "chat/".concat(index);
  $("header-text")[0].innerHTML = "<img src=\"".concat(window.chat[index].avator, "\">").concat(window.chat[index].name);
}
/**
 * Hide chat list
 *
 * hideChat(void) : void
 */


function hideChat() {
  location.hash = "";
  $("panel")[0].style.setProperty("--display", "none");
  $("panel")[0].style.setProperty("--visibility", "hidden");
  $("side-panel")[0].style.setProperty("--display", "block");
  $("side-panel")[0].style.setProperty("--visibility", "unset");
  $("header-text")[0].innerHTML = "WebQQ";
}

function toggleMenu() {
  var menu = $("flyout")[0];

  if (menu.className == "closed") {
    menu.className = "close";
    var a = window.setTimeout(function () {
      $("flyout")[0].className = "";
    }, 10);
    window.addEventListener("mousedown", function () {
      return closeMenuListener(menu, event);
    });
  } else {
    window.removeEventListener("mousedown", function () {
      return closeMenuListener(menu, event);
    });
    menu.className = "close";

    var _a = window.setTimeout(function () {
      $("flyout")[0].className = "closed";
    }, 233);
  }
}

function closeMenuListener(menu, event) {
  for (var i = 0; i < menu.childNodes.length; i++) {
    if (event.target == menu.childNodes[i]) {
      return;
    } else {
      toggleMenu();
    }
  }
}

function sendTextMsg() {
  if ($("textbar input")[0].value == "" || $("textbar input")[0].value == undefined) return;
  var chatId = location.hash.split("/")[1];
  window.chat[chatId].send(new _message.TextMessage(new _user.UserSelf(), $("textbar input")[0].value));
  var index = location.hash.split("/")[1];
  window.chat[index].records.show($(".message-container")[0]);
  $("textbar input")[0].value = "";
}

function scrollToBottom(obj) {
  obj.scrollTop = obj.scrollHeight;
}