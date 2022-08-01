import {useMemo} from 'react';

export const useSearch = (posts, search, fetchPosts, page, limit)=> {
const getSearch = useMemo(()=>{
    console.log('ebanytsa')

   
    if(search){
      let AllPages = -1; let AllLimit = -1;
     
    return  fetchPosts(AllPages, AllLimit), [...posts].filter((el)=>{return el.title.toLowerCase().includes(search)})
  }else{ return posts;
  }} , [posts,search])

return getSearch;
}