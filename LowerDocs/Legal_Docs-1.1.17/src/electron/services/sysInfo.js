const { ipcRenderer } = require('electron');
let sysInfo = undefined;

(() => {
    ipcRenderer.send('getSysInfo', true)
    ipcRenderer.on('getSysInfo', (event, args) => {
     sysInfo = args;
    });
})();

const isLoad = () => {
    return sysInfo !== undefined;
}

const get = () => {
    return sysInfo;
};

export default {get, isLoad};