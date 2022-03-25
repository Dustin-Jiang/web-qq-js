"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

require("core-js/modules/es.object.set-prototype-of.js");

require("core-js/modules/es.object.get-prototype-of.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.reflect.construct.js");

require("core-js/modules/es.object.create.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.UserSelf = exports.Group = exports.Friend = exports.Contact = void 0;

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.concat.js");

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var User = /*#__PURE__*/function () {
  function User(user_id, nickname) {
    _classCallCheck(this, User);

    this.user_id = user_id;
    this.nickname = nickname;
  }

  _createClass(User, [{
    key: "toString",
    value: function toString() {
      return this.nickname;
    }
  }]);

  return User;
}();

exports["default"] = User;

var UserSelf = /*#__PURE__*/function (_User) {
  _inherits(UserSelf, _User);

  var _super = _createSuper(UserSelf);

  function UserSelf() {
    _classCallCheck(this, UserSelf);

    return _super.call(this, window.account.id, window.account.name);
  } // To capable with message "self" tag.


  _createClass(UserSelf, [{
    key: "toString",
    value: function toString() {
      return "self";
    }
  }]);

  return UserSelf;
}(User);

exports.UserSelf = UserSelf;

var Contact = /*#__PURE__*/_createClass(function Contact(id, type, name, avator, records) {
  _classCallCheck(this, Contact);

  this.type = type;
  this.name = name;
  this.id = id;
  this.avator = avator;
  this.records = records;
});

exports.Contact = Contact;

var Friend = /*#__PURE__*/function (_Contact) {
  _inherits(Friend, _Contact);

  var _super2 = _createSuper(Friend);

  /**
   *
   * @param {Number} id User QQ ID
   * @param {String} name User nickname
   * @param {Records} records An Array contains `Records` objects to contain chat records
   */
  function Friend(id, name, records) {
    _classCallCheck(this, Friend);

    return _super2.call(this, id, "Friend", name, "http://q1.qlogo.cn/g?b=qq&s=640&nk=".concat(id), records);
  }
  /**
   *
   * @param {Number} index HTML `data-index` to get correct chat history
   * @returns
   */


  _createClass(Friend, [{
    key: "list",
    value: function list(index) {
      return "<div class=\"user\" data-index=\"".concat(index, "\">\n      <avator><img src=\"").concat(this.avator, "\"></avator>\n      <div class=\"user-info\">\n        <name>").concat(this.name, "</name>\n        <message>").concat(this.records.latest().content, "</message>\n      </div>\n    </div>");
    }
  }, {
    key: "send",
    value: function send(message) {
      $.ajax("".concat(window.apiUrl, "/send/text/").concat(window.account.id, "/").concat(this.type, "/").concat(this.id, "/").concat(message.content)).done(function (data) {
        console.log(data);
      });
      return this.records.append(message);
    }
  }]);

  return Friend;
}(Contact);

exports.Friend = Friend;

var Group = /*#__PURE__*/function (_Contact2) {
  _inherits(Group, _Contact2);

  var _super3 = _createSuper(Group);

  function Group(id, name, records) {
    _classCallCheck(this, Group);

    return _super3.call(this, id, "Group", "https://p.qlogo.cn/gh/".concat(id, "/").concat(id, "/640"), name, records);
  }

  _createClass(Group, [{
    key: "list",
    value: function list(index) {
      return "<div class=\"user\" data-index=\"".concat(index, "\">\n      <avator><img src=\"").concat(this.avator, "\"></avator>\n      <div class=\"user-info\">\n        <group>").concat(this.name, "</group>\n        <name>").concat(this.records.latest().sender, "</name>\n        <message>").concat(this.records.latest().content, "</message>\n      </div>\n    </div>");
    }
  }]);

  return Group;
}(Contact);

exports.Group = Group;