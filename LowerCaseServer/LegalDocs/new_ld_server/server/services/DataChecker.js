module.exports.checkFields = (needle, haystack) => {
    let isError = false;
    let errorStack = [];
    if(Array.isArray(needle)){
        needle.forEach(e => {
            if(!haystack.hasOwnProperty(e)){
                isError = true;
                errorStack.push(e);
            }
        });
    } else {
        isError = true;
    }

    return {
        isError: isError,
        errorStack: errorStack
    };
};