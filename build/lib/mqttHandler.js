"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var mqttHandler_exports = {};
__export(mqttHandler_exports, {
  MqttHandler: () => MqttHandler
});
module.exports = __toCommonJS(mqttHandler_exports);
var mqtt = __toESM(require("mqtt"));
var import_constants = require("./constants");
class MqttHandler {
  client = null;
  adapter;
  constructor(adapter) {
    this.adapter = adapter;
  }
  connect() {
    if (this.adapter.isUnloaded) {
      return;
    }
    if (this.client) {
      this.destroy();
    }
    this.client = mqtt.connect(`mqtt://${import_constants.MQTT_HOST}:${import_constants.MQTT_PORT}`, {
      username: import_constants.MQTT_USERNAME,
      password: import_constants.MQTT_PASSWORD,
      clientId: `iobroker_${this.adapter.namespace}`,
      reconnectPeriod: 1e4,
      clean: true
    });
    const topics = [import_constants.MQTT_STATE_TOPIC, import_constants.MQTT_STATUS_TOPIC];
    this.client.on("connect", async () => {
      var _a, _b;
      if (this.adapter.isUnloaded) {
        (_a = this.client) == null ? void 0 : _a.end(true);
        return;
      }
      this.adapter.log.info(`(PID: ${process.pid}) [MQTT] Connected. Subscribing to ${topics.join(",")}`);
      (_b = this.client) == null ? void 0 : _b.subscribe(topics);
      await this.adapter.setState("info.connection", true, true);
    });
    this.client.on("message", async (topic, message) => {
      if (this.adapter.isUnloaded || !this.client) {
        return;
      }
      await this.processMessage(topic, message.toString());
    });
    this.client.on("error", (err) => {
      if (!this.adapter.isUnloaded) {
        this.adapter.log.error(`[MQTT] Error: ${err.message}`);
      }
    });
    this.client.on("close", async () => {
      if (!this.adapter.isUnloaded) {
        await this.adapter.setState("info.connection", false, true);
      }
    });
  }
  destroy() {
    if (this.client) {
      this.client.removeAllListeners();
      this.client.on("error", () => {
      });
      this.client.end(true);
      this.client = null;
    }
  }
  async processMessage(topic, message) {
    if (this.adapter.isUnloaded) {
      return;
    }
    const parts = topic.split("/");
    if (parts.length < 4) {
      return;
    }
    const messageType = parts[1];
    const messageId = parts[2];
    const messagePath = parts[3];
    if (messageType === "sensor" && messagePath === "state") {
      const stateId = this.adapter.sensorToStateIdMap[messageId];
      const val = parseFloat(message);
      if (stateId && !isNaN(val)) {
        await this.adapter.setState(stateId, val, true);
      }
    } else if (messageType === "station" && messagePath === "status") {
      if (messageId && message) {
        const isSending = "online" == message;
        await this.adapter.setState(`${messageId}.sendingData`, isSending, true);
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MqttHandler
});
//# sourceMappingURL=mqttHandler.js.map
