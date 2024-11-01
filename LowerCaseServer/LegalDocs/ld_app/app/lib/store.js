const electron = require("electron");
const Core = require("./../core");
const L_Storage = require('electron-localstorage');

let STORAGE = null;

module.exports = {
    initStorage: async function(storageName){
        let storageData = {};
        STORAGE = storageName;

        try{
            storageData = this.getStorage(STORAGE);
        } catch (e) {
            if(e.code === "UNSET_STORAGE")
                storageData = {};
        }
        
        return await L_Storage.setItem(STORAGE, storageData);
    },

    getStorage: async function(storageName){
        if(storageName === undefined && STORAGE === null)
            throw new this.storeException("Undefined storage!", "UNDEFINED_STORAGE");

        storageName = storageName === undefined ? STORAGE : storageName;

        const storageData = await L_Storage.getItem(storageName);

        if(storageData === null)
            throw new this.storeException("Storage is unset!", "UNSET_STORAGE");
            
        return storageData;
    },

    setStorage: async function(value, storageName){
        if(storageName === undefined && STORAGE === null)
            throw new this.storeException("Undefined storage!", "UNDEFINED_STORAGE");

        storageName = storageName === undefined ? STORAGE : storageName;

        return await L_Storage.setItem(storageName, value);
    },

    clearStorage: async function(storageName){
        if(storageName === undefined && STORAGE === null)
            throw new this.storeException("Undefined storage!", "UNDEFINED_STORAGE");

        storageName = storageName === undefined ? STORAGE : storageName;

        return await L_Storage.removeItem(storageName);
    },

    getItem: function(item, storageName){
        if(storageName === undefined && STORAGE === null)
            throw new this.storeException("Undefined storage!", "UNDEFINED_STORAGE");

        storageName = storageName === undefined ? STORAGE : storageName;
        
        const storageData = this.getStorage(storageName);

        if(!storageData.hasOwnProperty(item))
            throw new this.storeException(`Item "${item}" is not exists in storage "${storageName}"`, "UNDEFINED_ITEM");

        return storageData[item];
    },

    setItem: function(item, value, storageName){
        if(storageName === undefined && STORAGE === null)
            throw new this.storeException("Undefined storage!", "UNDEFINED_STORAGE");

        storageName = storageName === undefined ? STORAGE : storageName;

        const storageData = this.getStorage(storageName);

        storageData[item] = value;

        return this.setStorage(storageData, storageName);
    },

    storeException: function(message, code) {
        this.message = message;
        this.name = "Storage exception";
        this.code = code;
     }
};