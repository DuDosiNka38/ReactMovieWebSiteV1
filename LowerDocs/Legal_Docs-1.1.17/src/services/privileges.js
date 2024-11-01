// import HANDLER from './handler';

const check = (privName, pData) => { 
    if(pData.length == 0)
        return false;

    if(!pData.hasOwnProperty("Privileges"))
        return false;
        
    const result =  pData.Privileges.find((x) => x.Privilege === privName);

    if(result !== undefined)
        return true;
    else 
        return false;
}



export default {check};