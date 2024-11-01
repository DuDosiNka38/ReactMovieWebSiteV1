const { ipcMain } = require('electron');
const async = require("async");
const store = require("../store");
const MainActions = require("../store/main/actions");

ipcMain.on("onSysInfo", (event, args) => {
    const si = require("systeminformation");
    const sysInfo = {
        users: null,
        os: null,
        uuid: null,
        network: null,
    };

    async.series(
        [
          function (callback) {
            if (sysInfo.uuid == null)
              si.uuid()
                .then((x) => (sysInfo.uuid = x))
                .then(() => callback(null, 1));
            else callback(null, 1);
          },
          function (callback) {
            if (sysInfo.os == null)
              si.osInfo()
                .then((x) => (sysInfo.os = x))
                .then(() => callback(null, 1));
            else callback(null, 2);
          },
          function (callback) {
            if (sysInfo.users == null)
              si.users()
                .then((x) => (sysInfo.users = x))
                .then(() => callback(null, 1));
            else callback(null, 3);
          },
          function (callback) {
            if (sysInfo.network == null)
              si.networkInterfaces()
                .then((x) => (sysInfo.network = x))
                .then(() => callback(null, 1));
            else callback(null, 4);
          },
        ],
        function (err, results) {
          store.dispatch(MainActions.setSystemInfo(sysInfo));
          event.sender.send("onSysInfo", sysInfo);
        }
      );
});