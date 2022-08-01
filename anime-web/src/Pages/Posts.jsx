import React, { useEffect, useState } from 'react';
import Comments from '../UI/Comments';
import Counter from '../UI/counter';
import PostList from '../UI/PostList';
import '../styles/App.css';
import PostForm from '../UI/PostForm';
import Input from '../Components/Input';
import { useSearch } from '../hooks/Search';
import PostService from '../API/PostService';
import { getPages } from '../utilits/pages';
import Button from '../Components/Button';
import {Link} from "react-router-dom";




function Posts() {




const [posts, setPosts] = useState([
]);
const [search, setSearch] = useState("");

const [limit, setLimit] = useState(15);
const [page, setPage] = useState(1);
const FilterSearch = useSearch(posts, search, fetchPosts, page, limit);
const [load, setLoad] = useState(false);
const [totalpage, setTolalPage] = useState(0);


const MorePages = function(page,limit){console.log(page); setLimit(limit); setPage(page); }

useEffect(()=>{return setPosts([fetchPosts(page,limit) ])},[page, limit])

  useEffect(() => { fetchPosts(page,limit) }, [])

  async function fetchPosts(page,limit) {
    // setLoad(true) 
    const response = await PostService.getAll(limit,page)
    let TolalCount = response.headers['x-total-count']
    setTolalPage(getPages(TolalCount, limit))
    setPosts(response.data)
    // setLoad(false)
  }
 

  const createPost = function (newpost) {
    setPosts([...posts, newpost])
  }
  const DeletePost = function (post) {
    setPosts(posts.filter(function (e) { return e.id !== post.id }))
  }


  return (
    <div >
       <Link to='/'> Back Home </Link>
      <PostForm createPost={createPost} />
      <Counter />
      <Comments />
      <Input
        placeholder='Search'
        value={search}
        onChange={event => setSearch(event.target.value)}/>
      <PostList posts={FilterSearch} deletepost={DeletePost} load={load} />
      <div className='more_pages'>
      
     <Button onClick={()=>{return MorePages(page + 1, limit + 15)}}> More</Button>
     </div>

      


    </div>
  );
}

export default Posts;

