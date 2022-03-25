"use strict";

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.array.from.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/es.regexp.test.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.is-array.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/web.timers.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.json.stringify.js");

var _records = _interopRequireDefault(require("../core/records"));

var _user = require("../core/user");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

window.account = JSON.parse(localStorage.getItem("user"));
window.apiUrl = "http://localhost:5000";
/**
 * Main Entry Point
 */

$(document).ready(function () {
  if (localStorage.getItem("user") == "" || localStorage.getItem("user") == undefined) window.location.href = "/login.html"; //Navigation Button Icon

  (0, _utils.navigateButton)(); //Navigation Button to back

  $(".navigator").click(_utils.hideChat); //Display ID

  $(".account-name")[0].innerHTML = window.account.name;
  $(".account-id")[0].innerHTML = window.account.id; //Display flyout menu

  $(".IconButton.avator").click(_utils.toggleMenu);
  $("actions button#exit-login").click(function () {
    localStorage.removeItem("user");
    window.location.href = "/login.html";
  }); //Handle Send Message

  $(".SendButton").click(_utils.sendTextMsg);
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey) {
      console.log("Ctrl");
    } else {
      if (event.keyCode == 13) {
        (0, _utils.sendTextMsg)();
      }
    }
  }); //Have cache, draw content before loading

  if (localStorage.getItem("chat") != undefined && localStorage.getItem) {
    for (var index in window.chat) {
      if (index == "length") continue;
      $(".user-list")[0].innerHTML += window.chat[index].list(index);
    }

    initialize();
  } else {
    //Initialize Friend List
    $.ajax("".concat(window.apiUrl, "/user/").concat(window.account.id, "/list/friend")).done(function (data) {
      var _iterator = _createForOfIteratorHelper(data),
          _step;

      try {
        var _loop2 = function _loop2() {
          var i = _step.value;
          window.chat.push(new _user.Friend(i[0], i[1].remark, new _records["default"]([], function (callback) {
            //Fetcher for historys
            $.ajax("".concat(window.apiUrl, "/history/pull/").concat(window.account.id, "/friend/").concat(i[0], "/latest") //@ts-ignore
            ).done(callback);
          }, window.chat.length)));
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop2();
        } //Then initialize Group List

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      $.ajax("".concat(window.apiUrl, "/user/").concat(window.account.id, "/list/group")).done(function (data) {
        var _iterator2 = _createForOfIteratorHelper(data),
            _step2;

        try {
          var _loop = function _loop() {
            var i = _step2.value;
            //Also Fetcher
            window.chat.push(new _user.Group(i[0], i[1].group_name, new _records["default"]([], //@ts-ignore
            function (callback) {
              $.ajax("".concat(window.apiUrl, "/history/pull/").concat(window.account.id, "/group/").concat(i[0], "/latest")).done(callback);
            }, window.chat.length)));
          };

          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            _loop();
          } // Finish Loading, now initialize lists
          // To avoid using async and Promise, using a timer

        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        setTimeout(initialize, 500);
      });
    });
  }
});
/**
 * Another Main Entry after ajax
 */

function initialize() {
  //Display Users
  var _iterator3 = _createForOfIteratorHelper($(".avator img")),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var i = _step3.value;
      i.src = "http://q1.qlogo.cn/g?b=qq&s=640&nk=".concat(window.account.id);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  (0, _utils.showChat)(); //Show chat and Change navigation button icons

  window.addEventListener("hashchange", function () {
    (0, _utils.navigateButton)();

    if (location.hash.split("/")[1] === undefined) {
      (0, _utils.hideChat)();
    } else (0, _utils.showChat)();
  }); //Display Chat List

  $(".user-list").delegate(".user", "click", function (event) {
    var index = event.currentTarget.dataset.index;
    location.hash = "chat/".concat(index);
    (0, _utils.showChat)();
  }); //10 seconds after load, cache everything.

  setTimeout(function () {
    localStorage.setItem("chat", JSON.stringify(window.chat));
  }, 10000);
}