const HostsDB = require("./AppDB")("app-hosts");
const Functions = require("./../lib/functions");
const axios = require("axios");
const path = require("path");
const { writeToConsole } = require("./../lib/functions");

const schema = {
  host: "http://127.0.0.1:80",
  alias: "Local Host",
  active: "true | false",
  timestamp: "000000000",
  ports: {},
};

// HostsDB.remove({});

module.exports = {
  getSchema: () => {
    console.log(schema);
    return schema;
  },

  isExist: async (host) => {
    return Boolean(HostsDB.find({ host: host }).then((r) => r).length);
  },

  isEmpty: async () => {
    return !Boolean(HostsDB.count({}).then((r) => r));
  },

  addHost: async (data) => {
    const toggleActive = data.active;
    data.active = false;
    const result = await HostsDB.insert({ ...data, timestamp: Functions.getCurrentTimestamp() }).then((r) => r);

    if (toggleActive) {
      await module.exports.toggleActiveHost(result);
    }

    return result;
  },

  updateHost: async (params, set) => {
    return await HostsDB.findOne(params).then((r) => {
      if (r) {
        return HostsDB.update({ _id: r._id }, { ...r, ...set }).then((r) => r);
      }

      return false;
    });
  },

  deleteHost: async (params) => {
    return await HostsDB.remove(params).then((r) => r);
  },

  getHost: async (params) => {
    return await HostsDB.findOne(params).then((r) => r);
  },

  getHosts: async () => {
    return await HostsDB.find({}).then((r) => r);
  },

  getActiveHost: async () => {
    return await HostsDB.findOne({ active: true }).then((r) => r);
  },

  toggleActiveHost: async (params) => {
    await HostsDB.findOne({ active: true }).then((r) => {
      if (r) {
        HostsDB.update({ _id: r._id }, { ...r, active: false });
      }
    });
    return await HostsDB.findOne(params).then((r) => {
      if (r) {
        return HostsDB.update({ _id: r._id }, { ...r, active: true }).then((r) => r);
      }
    });
  },

  checkHost: async (host) => {
    const response = await axios
      .get(`${host}api/handshake`, { timeout: 10000 })
      .then((r) => r)
      .catch((e) => e);

    if (
      (response.hasOwnProperty("isAxiosError") && response.isAxiosError) ||
      (response.data.data && !response.data.data.result)
    ) {
      return { result: false, data: response.data };
    }

    return {
      result: true,
      data: response.data,
    };
  },

  removeOldHosts: async () => {
    const hosts = await module.exports.getHosts();
    hosts.map((x) => {
      if (x.timestamp <= 1629741478) {
        module.exports.deleteHost({ host: x.host });
      }
    });
    return true;
  },
};
