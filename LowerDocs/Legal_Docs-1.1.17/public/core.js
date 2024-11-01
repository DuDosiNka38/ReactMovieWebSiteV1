var http = require('http');
var fs = require('fs');
const md5File = require('md5-file');
const { ipcMain, Notification } = require('electron');
const electron = require("electron");
const app = electron.app;

const APP_DATA_FOLDER = app.getPath("userData");

console.log("App folder", APP_DATA_FOLDER);

module.exports = {
    searchFiles: function(dir, cb, onEndCb) {
        var results = [];
        var list = fs.readdirSync(dir);
        list.forEach(function(file) {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) { 
                /* Recurse into a subdirectory */
                module.exports.searchFiles(file, cb);
            } else { 
                /* Is a file */
                if(cb !== null && cb !== undefined)
                    cb(file);
            }
        });

        if(onEndCb !== null && onEndCb !== undefined)
            onEndCb();

        // return results;
    },
      
    createDir: async function(path){
        try{
            let p = path.split("/");
            
            if(p[0] == "")
                p = p.slice(1);
            
            if(p[p.length-1] == "")
                p = p.slice(0, (p.length - 1));
            
            for(let i = 0; i < p.length; ++i){
                let part = `/${p.slice(0, (i+1)).join("/")}/`;
                
                if(!fs.existsSync(part)){
                    try{
                        await fs.promises.mkdir(part, { recursive: true });
                    } catch(e){
                        console.log(e);
                    }
                }
            }
        } catch(e) {
            console.log(e)
        }
    },
      
    checkFileHash: function(hash, appDir){
        const files = module.exports.searchFiles(appDir);
        let ret = [];
        for(let i in files){
            if(md5File.sync(files[i]) == hash){
            ret.push(files[i]);
            }
        }
        return ret.length == 0 ? true : ret;
    },

    getFileHash: function(path){
        return md5File.sync(path);
    },

    getAllLocalFiles: function(dirs){
        
    },

    convertBytesToNormal: function(bytes){
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        
        if (bytes !== 0) {
            const i = parseInt(
            Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)),
            10
            );
            if (i === 0) return `${bytes} ${sizes[i]}`;
            return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
        } else {
            return 0;
        }
    },
    
    convertBytesToMB: function(bytes){
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        
        if (bytes !== 0) {
            const i = 2;
            if (i === 0) return `${bytes} ${sizes[i]}`;
            return (bytes / 1024 ** i).toFixed(1);
        } else {
            return 0;
        }
    },

    showNotification: function(title, body){
        new Notification({ title: title, body: body }).show();
    },

    isAppDataFolderExists: function(){
        if(!fs.existsSync(`${this.getAppDataFolder()}`)){
            this.createDir(`${this.getAppDataFolder()}`);
            return true;
        } else {
            return true;
        }
    },

    getAppDataFolder: function(){
        return APP_DATA_FOLDER;
    },

    getConfig: function(){
        const AppFolder = this.getAppDataFolder();
        const FileName = "appConfig.json";
        const FilePath = `${AppFolder}/${FileName}`;

        if(fs.existsSync(FilePath)){
            const data = fs.readFileSync(FilePath, "utf8");
            return data !== "" ? JSON.parse(data) : {};
        } else {
            return {};
        }
        
    },

    setConfig: function(obj){
        const AppFolder = this.getAppDataFolder();
        const FileName = "appConfig.json";
        const FilePath = `${AppFolder}/${FileName}`;

        let appConfig = this.getConfig();
        appConfig.lastUpdate = this.getCurrentTimestamp();

        if(!("createdDate" in appConfig))
            appConfig.createdDate = this.getCurrentTimestamp();

        // if(!fs.existsSync(FilePath)){

        //     fs.writeFile(FilePath, JSON.stringify(appConfig), (err) => {
        //         if(err) throw err;

        //         fs.chmod(FilePath, "0777",(err) => {
        //             if(err) throw err;
        //         });
        //     });
        // }

        if(obj !== null && obj !== undefined){
            for(let k in obj){
                const v = obj[k];
                appConfig[k] = v;
            }

            fs.writeFile(FilePath, JSON.stringify(appConfig), (err) => {
                if(err) throw err;
            });

            fs.chmod(FilePath, "0777",(err) => {
                if(err) throw err;
            });
        }

        return appConfig;
    },

    getScanMap: function(){
        const AppFolder = this.getAppDataFolder();
        const FileName = "scan_map.json";
        const FilePath = `${AppFolder}/${FileName}`;

        //Create file if not exists
        if(!fs.existsSync(FilePath)){
            return this.setScanMap();
        }

        const ScanMap = JSON.parse(fs.readFileSync(FilePath, "utf8"));
        return ScanMap;
    },

    setScanMap: function(map){
        map = map === undefined ? {lastScanTime: null, scannedDirs: [], scanResult: {}} : map;
        
        const AppFolder = this.getAppDataFolder();
        const FileName = "scan_map.json";
        const FilePath = `${AppFolder}/${FileName}`;

        //Create file if not exists
        fs.writeFile(FilePath, JSON.stringify(map), (err) => {
            if(err) throw err;
        });
        // if(fs.existsSync(FilePath)){
        //     fs.chmod(FilePath, "0777",(err) => {
        //         if(err) throw err;
        //     });
        // } else {
        //     return this.getScanMap();
        // }
    },

    getCurrentTimestamp: function(){
        return Math.ceil(Date.now()/1000);
    },

    getCurrentTimestampMS: function(){
        return Date.now();
    }
      
};