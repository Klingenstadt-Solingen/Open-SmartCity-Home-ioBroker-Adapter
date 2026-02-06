"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var constants_exports = {};
__export(constants_exports, {
  API_PASSWORD: () => API_PASSWORD,
  API_URL: () => API_URL,
  API_USER: () => API_USER,
  MQTT_HOST: () => MQTT_HOST,
  MQTT_PASSWORD: () => MQTT_PASSWORD,
  MQTT_PORT: () => MQTT_PORT,
  MQTT_STATE_TOPIC: () => MQTT_STATE_TOPIC,
  MQTT_STATUS_TOPIC: () => MQTT_STATUS_TOPIC,
  MQTT_USERNAME: () => MQTT_USERNAME
});
module.exports = __toCommonJS(constants_exports);
const MQTT_HOST = "159.69.38.127";
const MQTT_PORT = 1883;
const MQTT_USERNAME = "demo-user";
const MQTT_PASSWORD = "demo-password";
const MQTT_STATE_TOPIC = "opensmartcityhome/sensor/+/state";
const MQTT_STATUS_TOPIC = "opensmartcityhome/station/+/status";
const API_URL = "http://159.69.38.127:8888/stations";
const API_USER = "client";
const API_PASSWORD = "client-password";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  API_PASSWORD,
  API_URL,
  API_USER,
  MQTT_HOST,
  MQTT_PASSWORD,
  MQTT_PORT,
  MQTT_STATE_TOPIC,
  MQTT_STATUS_TOPIC,
  MQTT_USERNAME
});
//# sourceMappingURL=constants.js.map
