const myStorage = window.localStorage;
const itemName = "hash";

function getHash(){
    return myStorage.getItem(itemName);
}

function setHash(hash){
    return myStorage.setItem(itemName, hash);
}

function closeSession(){
    return myStorage.clear();
}


export default {setHash, getHash, closeSession};