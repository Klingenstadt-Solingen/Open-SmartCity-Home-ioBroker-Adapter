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
var readyHandler_exports = {};
__export(readyHandler_exports, {
  handleReady: () => handleReady
});
module.exports = __toCommonJS(readyHandler_exports);
async function handleReady(adapter) {
  const label = `[onReady] Total Execution (PID: ${process.pid})`;
  console.time(label);
  adapter.log.info(`(PID: ${process.pid}) >> ${label} starting...`);
  try {
    await adapter.setObjectNotExistsAsync("info", {
      type: "channel",
      common: { name: "Information" },
      native: {}
    });
    await adapter.setObjectNotExistsAsync("info.connection", {
      type: "state",
      common: {
        role: "indicator.reachable",
        name: "Device or service connected",
        type: "boolean",
        read: true,
        write: false,
        def: false
      },
      native: {}
    });
    if (adapter.config.stations && Array.isArray(adapter.config.stations)) {
      adapter.log.info(`(PID: ${process.pid}) Syncing stations...`);
      await syncStationsToObjects(adapter);
      adapter.log.info(`(PID: ${process.pid}) Syncing stations... Done`);
    }
    const allObjects = await adapter.getAdapterObjectsAsync();
    adapter.sensorToStateIdMap = {};
    for (const id in allObjects) {
      const obj = allObjects[id];
      if (obj && obj.native && obj.native.sensorId) {
        adapter.sensorToStateIdMap[obj.native.sensorId] = id;
      }
    }
    adapter.log.info(`(PID: ${process.pid}) << ${label} finished.`);
  } catch (e) {
    adapter.log.error(`(PID: ${process.pid}) [onReady] Critical error: ${e.message}`);
  } finally {
    console.timeEnd(label);
  }
}
async function syncStationsToObjects(adapter) {
  const label = `[syncStationsToObjects]`;
  adapter.log.debug(`(PID: ${process.pid}) >> ${label} starting...`);
  try {
    const adapterObject = await adapter.getForeignObjectAsync(`system.adapter.${adapter.namespace}`);
    if (!adapterObject || !adapterObject.native) {
      adapter.log.error(`(PID: ${process.pid}) Could not fetch adapter configuration!`);
      return;
    }
    const currentConfig = adapterObject.native;
    const currentStations = currentConfig.stations || [];
    const allowedIds = /* @__PURE__ */ new Set();
    allowedIds.add(`${adapter.namespace}.info`);
    allowedIds.add(`${adapter.namespace}.info.connection`);
    for (const station of currentStations) {
      if (station.requestingData) {
        const stationFullId = `${adapter.namespace}.${station.stationId}`;
        allowedIds.add(stationFullId);
        allowedIds.add(`${stationFullId}.sendingData`);
        if (station.sensors) {
          for (const sensor of station.sensors) {
            allowedIds.add(`${stationFullId}.${sensor.sensorId}`);
          }
        }
      }
    }
    const allObjects = await adapter.getAdapterObjectsAsync();
    const deleteBatch = Object.keys(allObjects).filter((id) => id.startsWith(adapter.namespace) && !allowedIds.has(id)).map((id) => adapter.delObjectAsync(id));
    if (deleteBatch.length > 0) {
      await Promise.all(deleteBatch);
    }
    const creationBatch = [];
    for (const station of currentStations) {
      if (station.requestingData) {
        const isSending = "online" === station.stationStatus;
        const iconPath = "images/";
        const stationIcon = isSending ? "green.png" : "red.png";
        creationBatch.push(
          adapter.extendObject(station.stationId, {
            type: "channel",
            common: {
              name: station.stationName,
              icon: iconPath + stationIcon
            },
            native: { status: station.stationStatus, stationId: station.stationId }
          })
        );
        creationBatch.push(
          adapter.extendObject(`${station.stationId}.sendingData`, {
            type: "state",
            common: {
              name: "Sending Data",
              type: "boolean",
              role: "indicator.reachable",
              read: true,
              write: false
            },
            native: {}
          })
        );
        if (station.sensors) {
          for (const sensor of station.sensors) {
            creationBatch.push(
              adapter.extendObject(`${station.stationId}.${sensor.sensorId}`, {
                type: "state",
                common: {
                  name: sensor.sensorName,
                  type: "number",
                  role: "value",
                  unit: sensor.sensorUnit,
                  read: true,
                  write: false
                },
                native: { sensorId: sensor.sensorId }
              })
            );
          }
        }
      }
    }
    if (creationBatch.length > 0) {
      await Promise.all(creationBatch);
    }
    for (const station of currentStations) {
      if (station.requestingData) {
        if (station.stationStatus) {
          const isSending = ["active", "online", "ok"].includes(station.stationStatus.toLowerCase());
          await adapter.setState(`${station.stationId}.sendingData`, { val: isSending, ack: true });
        }
        if (station.sensors) {
          for (const sensor of station.sensors) {
            if (sensor.sensorState !== void 0) {
              await adapter.setState(`${station.stationId}.${sensor.sensorId}`, {
                val: sensor.sensorState,
                ack: true
              });
            }
          }
        }
      }
    }
  } catch (e) {
    adapter.log.error(`(PID: ${process.pid}) [syncStationsToObjects] Error: ${e.message}`);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleReady
});
//# sourceMappingURL=readyHandler.js.map
