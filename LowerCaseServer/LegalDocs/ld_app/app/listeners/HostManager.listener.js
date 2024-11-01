const { ipcMain } = require('electron');
const HostManager = require("../core/HostManager");
const axios = require("../lib/axios")


ipcMain.on("onIsEmpty", async (event, args) => {
    event.returnValue = await HostManager.isEmpty();
});

ipcMain.on("onAddHost", async (event, args) => {
    event.returnValue = await HostManager.addHost(args);
    event.sender.send("onHostsChange", {});
});

ipcMain.on("onUpdateHost", async (event, args) => {
    const {params, set} = args;
    event.returnValue = await HostManager.updateHost(params, set);
    event.sender.send("onHostsChange", {});
});

ipcMain.on("onDeleteHost", async (event, args) => {
    event.returnValue = await HostManager.deleteHost(args);
    event.sender.send("onHostsChange", {});
});

ipcMain.on("onGetHost", async (event, args) => {
    const host = await HostManager.getHost({args});
    event.returnValue = host.substr(0, host.length-1);
});

ipcMain.on("onGetHosts", async (event, args) => {
    const val = await HostManager.getHosts();
    event.returnValue = val;
});

ipcMain.on("onActiveHost", async (event, args) => {
    event.returnValue = await HostManager.getActiveHost();
});

ipcMain.on("onToggleActiveHost", async (event, args) => {
    event.returnValue = await HostManager.toggleActiveHost(args);
    const hostData = await HostManager.getActiveHost();
    axios.defaults.baseURL = hostData ? hostData.host : null;
    event.sender.send("onHostsChange", {});
});

ipcMain.on("onCheckHost", async (event, args) => {
    const { host } = args;
    //Is Host Exists in App DB
    {
        const isExist = await HostManager.isExist(host);
        if(isExist){
            event.sender.send("onCheckHost", {
                result: false,
                data: {
                    error_code: "HOST_IS_EXISTS",
                    error_message: "Typed host already exists!",
                    error_data: host
                }
            });
            return false;
        }
    }

    //Check is typed host valid
    const checkResult = await HostManager.checkHost(host);
    event.sender.send("onCheckHost", {checkResult});
});
