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
var messageHandler_exports = {};
__export(messageHandler_exports, {
  handleMessage: () => handleMessage
});
module.exports = __toCommonJS(messageHandler_exports);
var import_api = require("./api");
async function handleMessage(adapter, obj) {
  if (obj.command === "getStations") {
    try {
      const apiStations = await (0, import_api.fetchStations)(adapter.log);
      const activeStationIds = new Set(
        (adapter.config.stations || []).filter((s) => s.requestingData).map((s) => s.stationId)
      );
      const mergedStations = apiStations.map((apiStation) => {
        const isActive = activeStationIds.has(apiStation.stationId);
        return {
          ...apiStation,
          requestingData: isActive
          // True if found in the activeSet
        };
      });
      adapter.sendTo(obj.from, obj.command, mergedStations, obj.callback);
    } catch (e) {
      adapter.log.error(`(PID: ${process.pid}) [onMessage] [getStations] Error: ${e.message}`);
      adapter.sendTo(obj.from, obj.command, [], obj.callback);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleMessage
});
//# sourceMappingURL=messageHandler.js.map
