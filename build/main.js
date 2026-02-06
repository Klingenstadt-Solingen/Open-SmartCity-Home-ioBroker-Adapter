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
var main_exports = {};
__export(main_exports, {
  OpenSmartCityHome: () => OpenSmartCityHome
});
module.exports = __toCommonJS(main_exports);
var utils = __toESM(require("@iobroker/adapter-core"));
var import_readyHandler = require("./lib/readyHandler");
var import_messageHandler = require("./lib/messageHandler");
var import_unloadHandler = require("./lib/unloadHandler");
var import_mqttHandler = require("./lib/mqttHandler");
class OpenSmartCityHome extends utils.Adapter {
  // Helper properties need to be public for the handler
  sensorToStateIdMap = {};
  isUnloaded = true;
  // Instance of the new handler
  mqttHandler;
  /**
   * Constructor
   *
   * @param options
   */
  constructor(options = {}) {
    super({
      ...options,
      name: "open-smart-city-home"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("unload", this.onUnload.bind(this));
    this.on("message", this.onMessage.bind(this));
    this.mqttHandler = new import_mqttHandler.MqttHandler(this);
  }
  async onReady() {
    this.isUnloaded = false;
    await (0, import_readyHandler.handleReady)(this);
    this.mqttHandler.connect();
  }
  async onMessage(obj) {
    await (0, import_messageHandler.handleMessage)(this, obj);
  }
  async onUnload(callback) {
    this.isUnloaded = true;
    await (0, import_unloadHandler.handleUnload)(this, callback);
  }
}
if (require.main !== module) {
  module.exports = (options) => new OpenSmartCityHome(options);
} else {
  new OpenSmartCityHome();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OpenSmartCityHome
});
//# sourceMappingURL=main.js.map
