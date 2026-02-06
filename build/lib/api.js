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
var api_exports = {};
__export(api_exports, {
  fetchStations: () => fetchStations
});
module.exports = __toCommonJS(api_exports);
var import_axios = __toESM(require("axios"));
var import_constants = require("./constants");
async function fetchStations(log) {
  try {
    const response = await import_axios.default.get(import_constants.API_URL, {
      auth: {
        username: import_constants.API_USER,
        password: import_constants.API_PASSWORD
      },
      timeout: 5e3,
      headers: {
        Connection: "close"
      }
    });
    if (response.status !== 200) {
      return [];
    }
    return response.data.map((node) => {
      if (!node || !node.id || !node.name) {
        log.error(`[API] Received invalid station data from API: ${JSON.stringify(node)}`);
        return null;
      }
      const sensors = (node.sensors || []).map((s) => {
        var _a, _b, _c;
        return {
          sensorId: (_a = s.id) == null ? void 0 : _a.toString(),
          sensorName: (_b = s.name) == null ? void 0 : _b.toString(),
          sensorUnit: (_c = s.unit) == null ? void 0 : _c.toString(),
          sensorState: parseFloat(s.state) || 0
        };
      });
      return {
        stationId: node.id.toString(),
        stationName: node.name.toString(),
        stationStatus: (node.status || "unknown").toLowerCase(),
        sensors
      };
    }).filter((st) => st !== null);
  } catch (e) {
    log.error(`[API] Fetch failed: ${e.message}`);
    return [];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetchStations
});
//# sourceMappingURL=api.js.map
