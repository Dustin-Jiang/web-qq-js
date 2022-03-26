"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiRoot = exports.api = void 0;

var axios = require("axios");

var apiRoot = "http://localhost:5000";
exports.apiRoot = apiRoot;
var api = {
  get: function get(path) {
    return axios.get("".concat(apiRoot).concat(path));
  },
  post: function post(path, options) {
    return axios.post("".concat(apiRoot).concat(path), options);
  }
};
exports.api = api;