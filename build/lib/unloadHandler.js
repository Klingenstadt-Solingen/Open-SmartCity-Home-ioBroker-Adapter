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
var unloadHandler_exports = {};
__export(unloadHandler_exports, {
  handleUnload: () => handleUnload
});
module.exports = __toCommonJS(unloadHandler_exports);
async function handleUnload(adapter, callback) {
  const label = `[handleUnload]`;
  const cleanup = async () => {
    try {
      adapter.log.info(`${label} Stopping...`);
      const tasks = [];
      if (adapter.config.stations && Array.isArray(adapter.config.stations)) {
        for (const station of adapter.config.stations) {
          if (station.requestingData) {
            tasks.push(
              adapter.setState(`${station.stationId}.sendingData`, {
                val: false,
                ack: true
              })
            );
            tasks.push(
              adapter.extendObject(station.stationId, {
                common: {
                  icon: "images/red.png"
                }
              })
            );
          }
        }
      }
      if (tasks.length > 0) {
        await Promise.all(tasks);
        adapter.log.debug(`${label} Set ${tasks.length / 2} stations to offline.`);
      }
      if (adapter.mqttHandler) {
        adapter.mqttHandler.destroy();
      }
    } catch (e) {
      adapter.log.error(`${label} Error during cleanup: ${e.message}`);
    } finally {
      callback();
    }
  };
  await cleanup();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleUnload
});
//# sourceMappingURL=unloadHandler.js.map
