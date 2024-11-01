import React from 'react';
import './Ui.css';
import PostItem from './PostItem';



const PostList = function ({ posts, deletepost, load, MorePages, page , limit}) {



  return (
  <div className='PostsBlock'>
      <h1>СписоЧеЧек</h1>
      <div className='post-block'>

        {load ? <h1>Загрузка...</h1> : posts.length ? posts.map((el, index) => <PostItem deletepost={deletepost} number={index + 1} key={el.id} post={el} />) :
            <h1 className='EmptyField'>Еба а где все?</h1>

        }
      </div> 
     
    </div>
    
    
  )
};

export default PostList;
