export const getPages = function(totalCount, limit){
    return Math.ceil(totalCount/limit)
}